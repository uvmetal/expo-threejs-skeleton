// This is a working react native expo threejs skeleton.

import Expo from "expo"
import { GLView } from 'expo-gl'
import React, { Component } from "react"
import * as THREE from "three"
import ExpoTHREE, { Renderer } from "expo-three"

import { Accelerometer } from 'expo-sensors'
import Constants from 'expo-constants'

import { View, Text, StyleSheet, Dimensions } from "react-native"

export default class App extends Component {
  state = {
    accelerometerData: { x: 0, y: 0, z: 0 },
  }

  componentWillUnmount() {
    this._unsubscribeFromAccelerometer()
  }

  componentDidMount() {
    this._subscribeToAccelerometer()
  }

  componentWillMount() {
    const { width, height } = Dimensions.get('window')
    this.screenWidth = width
    this.screenHeight = height
    this.boxWidth = this.screenWidth / 10.0
  }

  _subscribeToAccelerometer = () => {
    this._accelerometerSubscription = Accelerometer.addListener(
      accelerometerData => this.setState({ accelerometerData })
    )
  }

  _unsubscribeFromAccelerometer = () => {
    if (this._accelerometerSubscription) {
      this._acceleroMeterSubscription.remove()
      this._accelerometerSubscription = null
    }
  }

  render() {
    let { x, y, z } = this.state.accelerometerData

    return(
      <View style={styles.container}>

        <GLView
        ref={(ref) => this._glView = ref}
        style={{ flex: 1 }}
        onContextCreate={this._onGLContextCreate}/>

        <Text>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>

        <Text>x: {x} </Text>
        <Text>y: {y} </Text>
        <Text>z: {z} </Text>
      </View>

    )
  }

  _onGLContextCreate = async (gl) => {
    // Doesn't work on Android 12/7/2020
    // const arSession = await this._glView.startARSessionAsync()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000)
    const renderer = new Renderer({ gl })
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 5

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)

      cube.rotation.x += 0.07
      cube.rotation.y += 0.04

      gl.endFrameEXP()
    }
    animate()
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#333333',
    padding: 8,
  }
});
