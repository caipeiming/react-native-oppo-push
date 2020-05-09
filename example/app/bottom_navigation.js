import React, { Component } from 'react';
import {NativeModules, requireNativeComponent, View, ViewPropTypes, Text, findNodeHandle, Dimensions} from 'react-native'
import PropTypes from 'prop-types';

const bottomNavigationModule = NativeModules.BottomNavigationModule;

export default class BottomNavigationView extends Component {
    static defaultProps = {
    }

    static propTypes = {
        ...ViewPropTypes,
        onMenuItemPress: PropTypes.func,
    }
    
    constructor(props) {
        super(props);
        this.onMenuItemPress = this._onMenuItemPress.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    _onMenuItemPress(event) {
        let {onMenuItemPress} = this.props;
        let data = event.nativeEvent;
        onMenuItemPress && onMenuItemPress(data);
    }

    render() {
        return (
            <NativeAMap {...this.props} onMenuItemPress={this.onMenuItemPress} />
        )
    }
}

const NativeAMap = requireNativeComponent('RCTBottomNavigationView', BottomNavigationView);
