//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'

const { ReactNativeTorBridge } = NativeModules

export default {
  exampleMethod () {
    return ReactNativeTorBridge.exampleMethod()
  },

  EXAMPLE_CONSTANT: ReactNativeTorBridge.EXAMPLE_CONSTANT
}
