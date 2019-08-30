//
//  TorURLDownloader.swift
//  iOSTorDemo
//
//  Created by Joel Cretan on 8/25/19.
//  Copyright © 2019 Joel Cretan. All rights reserved.
//

import Foundation
import Tor

extension Data {
  func hexEncodedString() -> String {
    return map { String(format: "%02hhx", $0) }.joined()
  }
}

@objc(TorURLDownloader)
class TorURLDownloader : NSObject {
    //MARK: properties
    var configuration: TorConfiguration
    var session: URLSession!
    var queue = DispatchQueue(label: "myqueue", qos: .userInitiated)
    var connectionLock: DispatchSemaphore
    var sessionLock: DispatchSemaphore
    
    //MARK: enums
    enum TorError: Error {
        case CookieError
        case ControlSocketError
        case LocalConnectionError
        case TorConnectionError
        case HTTPError
    }
    
    //MARK: initializers
    override init() {
        //isConnected = false
        configuration = TorConfiguration()

        configuration.cookieAuthentication = true
        configuration.dataDirectory = URL(fileURLWithPath: TorURLDownloader.createTorDirectory())
        configuration.controlSocket = configuration.dataDirectory?.appendingPathComponent("control_port")
        configuration.arguments = ["--ignore-missing-torrc"]
        
        connectionLock = DispatchSemaphore(value: 1)
        sessionLock = DispatchSemaphore(value: 1)
        print("tor init ok")
    }
    
    // https://github.com/iCepa/Tor.framework/issues/48#issuecomment-501944299
    private class func createTorDirectory() -> String {
        let torPath = self.getTorPath()
        do {
            try FileManager.default.createDirectory(atPath: torPath, withIntermediateDirectories: true, attributes: [
                FileAttributeKey.posixPermissions: 0o700
                ])
        } catch {
            print("Directory previously created. 🤷‍♀️")
        }
        return torPath
    }
    
    // https://github.com/iCepa/Tor.framework/issues/48#issuecomment-501944299
    private class func getTorPath() -> String {
        var torDirectory = ""
        #if targetEnvironment(simulator)
        print("is simulator")
        let path = NSSearchPathForDirectoriesInDomains(.applicationDirectory, .userDomainMask, true).first ?? ""
        torDirectory = "\(path.split(separator: Character("/"))[0..<2].joined(separator: "/"))/.tor_tmp"
        
        #else
        print("is device")
        torDirectory = "\(NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first ?? "")/t"
        #endif
        
        return torDirectory
    }
  
    @objc(connect)
    public func connect() -> Bool {
      print("connecting to tor")
        connectionLock.wait()
        if session != nil {
            connectionLock.signal()
            return true
        }
        sessionLock.wait() // immediate
        
        let thread: TorThread = TorThread(configuration: configuration)
        print("starting tor thread")
        thread.start()
        sleep(3) // wait for TorThread to start
        
        asyncConnectionBlock: do {
            guard let cookieURL: URL = configuration.dataDirectory?.appendingPathComponent("control_auth_cookie") else {
                print("something is wrong with the cookie URL!")
                sessionLock.signal()
                break asyncConnectionBlock
            }
            
            guard let ctrlSocket = configuration.controlSocket else {
                print("something is wrong with the control socket!")
                sessionLock.signal()
                break asyncConnectionBlock
            }
            print("got cookie URL: \(cookieURL)")
            
            print("initializing controller")
            let controller: TorController = TorController(socketURL: ctrlSocket)
            print("initialized controller")
                        
            print("controller is connected 1? \(controller.isConnected)")
            if !controller.isConnected {
                try controller.connect()
                print("controller is connected 2? \(controller.isConnected)")
            }
            
            let cookie: Data = try Data.init(contentsOf: cookieURL, options: NSData.ReadingOptions(rawValue: 0))
            let stringCookie = cookie.hexEncodedString()
            print("got cookie: \(stringCookie)")
            
            print("authenticating")
            controller.authenticate(with: cookie, completion: { (success: Bool, error: Error?) -> Void in
                print("finished authenticating")
                if (!success) {
                    print("failed to authenticate to tor control socket: \(error)")
                    self.sessionLock.signal()
                    return
                }
                print("authenticated to tor control socket")
                
                controller.addObserver(forCircuitEstablished: { (established: Bool) -> Void in
                    print("observer called")
                    if (!established) {
                        print("circuit not established")
                        // I think we don't signal here because this seems to happen sometimes without it being an error?
                        return
                    }
                    print("circuit established")
                    
                    controller.getSessionConfiguration( { (sessionConfiguration: URLSessionConfiguration?) -> Void in
                        guard let config = sessionConfiguration else {
                            print("missing session configuration")
                            self.sessionLock.signal()
                            return
                        }
                        
                        print("got session configuration, let's do it")
                        self.session = URLSession(configuration: config)
                        self.sessionLock.signal()
                    })
                })
            })
        } catch let error as Error {
            print("a try failed :(")
            print("\(error)")
            sessionLock.signal()
            return false
        }
        
        sessionLock.wait() // we already hold this lock, so we are waiting for the stuff within the async blocks to unlock it
        if session == nil {
            print("failed to get the Tor URLSession...there should be an error just above here ^")
            sessionLock.signal()
            connectionLock.signal()
            return false
        }
        sessionLock.signal()
        connectionLock.signal()
        return true
    }
    

    @objc(download:completion:)
    public func download(urlString: String, completion: @escaping RCTResponseSenderBlock ) {
        // do all of this on another thread because we may have to wait for locks
        // and we definitely have to wait for the various other threads we're going to call
        queue.async {
            if self.session == nil {
                /*do {
                    try self.connect()
                } catch let error {
                    print("Connection error: \(error)")
                    completion(false, nil)
                    return
                }*/
              let success = self.connect()
              guard success else {
                  print("Connection error...and this is hard to report to javascript")
                  completion([false, nil])
                  return
              }
            }
      
            let url = URL(string: urlString)!
            //receivedData = Data()
            
            let task = self.session.dataTask(with: url) { data, response, error in
                if let error = error {
                    print("error! \(error)")
                    completion([false, nil])
                    return
                }
                guard let httpResponse = response as? HTTPURLResponse,
                    (200...299).contains(httpResponse.statusCode) else {
                        print("http error!")
                        completion([false, nil])
                        return
                }
                print("ok!")
                if let data = data, let string = String(data: data, encoding: .utf8) {
                    completion([true, string])
                }
            }
            task.resume()
            print("resumed task")
        }
    }
    
}
