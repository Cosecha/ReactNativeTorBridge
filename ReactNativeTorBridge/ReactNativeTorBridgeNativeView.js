//  Created by react-native-create-bridge

import React, { Component } from 'react'
import { requireNativeComponent } from 'react-native'

const ReactNativeTorBridge = requireNativeComponent('ReactNativeTorBridge', ReactNativeTorBridgeView)

export default class ReactNativeTorBridgeView extends Component {
  render () {
    return <ReactNativeTorBridge {...this.props} />
  }
}

ReactNativeTorBridgeView.propTypes = {
  exampleProp: React.PropTypes.any
}
