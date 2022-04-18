import * as React from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component {
  constructor() {
    super();
    this.state = {
      image: null,
    };
  }
  getCameraPermission = async () => {
    if (Platform.OS != 'web') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('sorry, we need camera roll permissions to make this work');
      }
    }
  };

 

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({
          image: result.data,
        });
        console.log(result.uri)
        this.uploadImage(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getCameraPermission();
  }

  uploadImage = async (uri) => {
    const data = new FormData();
    let filename = uri.split('/')[uri.split('/').length - 1];
    console.log(uri.split('/'))
    let type = `image/${uri.split('.')[uri.split('.').length - 1]}`;
    console.log(type)
    const fileToUpload = {
      uri: uri,
      name: filename,
      type: type,
    };
    data.append('alphabet', fileToUpload);
    console.log(data)
    fetch('https://e56a-202-173-126-14.ngrok.io/predict-alphaabet', {
      method: 'POST',
      body: data,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  render() {
    let { image } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
      </View>
    );
  }
}



 