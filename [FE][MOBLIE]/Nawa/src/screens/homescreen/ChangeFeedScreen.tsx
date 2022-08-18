import React, { useEffect, useState } from "react";
import { ScrollView, Dimensions, StyleSheet, Alert, Platform, View, Image, Text, TouchableWithoutFeedback, Touchable } from "react-native";

import { Form, FormItem } from 'react-native-form-component';
import { Button, ScreenHeight } from "@rneui/base";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import userSlice from "../../slices/user";
import { useIsFocused } from "@react-navigation/native";
import Video from "react-native-video";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");


function ChangeFeedScreen({ navigation, route }) {
  // console.log(route)
  const boardId = route.params
  const whoamI = useSelector((state : RootState) => state.user.userId)
  const myId = useSelector((state: RootState) => state.user.accessToken)
  const url = 'http://i7d205.p.ssafy.io/api/board/'
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [newFiles, setNewFiles] = useState<object[]>([])
  const [files, setFiles] = useState<object[]>([])
  const [boardDate, setBoardDate] = useState<Date>(new Date);
  const [boardHit, setBoardHit] = useState<number>(0)
  const [boardLikes, setBoardLikes] = useState<number>(0)
  const [boardType, setBoardType] = useState<string>('')
  const [boardUpdate, setBoardUpdate] = useState<Date>(new Date)
  let delFiles: number[] = []
  let update: object[] = []

  useEffect(() => {
    axios.get(
      `${url}${boardId}`,
      { headers: { Authorization : `Bearer ${myId}` }}
    ).then (res => {
      console.log('피드 수정 불러오기 성공', res.data)
      const data = res.data;
      setTitle(data.boardTitle);
      setContent(data.boardContent);
      setFiles(data.files);
      setBoardDate(data.boardDate);
      setBoardHit(data.boardHit);
      setBoardLikes(data.boardLikes);
      setBoardType(data.boardType);
      setBoardUpdate(data.boardUpdate);
    }).catch (err => 
      console.log('피드 수정 init에서 문제 발생', err)
    )
  }, [])

  const changestatus = (id:number) => {
    const index = delFiles.indexOf(id)
    if (index > -1) {
      delFiles.splice(index, 1)
    } else {
      delFiles.push(id)
    }
    console.log(delFiles)
  }

  const openStorage = async () => {

    await launchImageLibrary(
      {
        mediaType: 'mixed',
        selectionLimit: 0,
      },
      (res) => {
      if(res.didCancel) {
        console.log('User Cancelled image picker')
      } else if(res.errorCode) {
        console.log(res.errorMessage)
      } else if(res.assets) {
        const medias = res.assets
        console.log(medias)
        medias.forEach(media => {
          const once = {
            name: media.fileName as string,
            type: media.type as string,
            uri: Platform.OS === 'android' ? media.uri as string : media.uri?.replace('file://', '') as string,
            width: media.width as number,
            height: media.height as number,
          }
          update.push(once)
        })
        setNewFiles(update)
        console.log('저장소에서 가져옴', newFiles)
      }
    })
  }
  
  const onSubmit = async () => {
    if ( !title ) {
      return Alert.alert('알림', '제목은 필수항목입니다')
    }
    if ( !content ) {
      return Alert.alert('알림', '글을 입력해주세요')
    }

    let changefiles = files.filter(file => !(file.fileName in delFiles))
    console.log('살아남은 파일', changefiles)

    let inputs = {
      "boardTitle": title, //
      "boardContent": content, //
      "userId": whoamI, //
      "boardDate": boardDate,
      "boardHit": boardHit,
      "boardId": boardId,
      "boardLikes": boardLikes,
      "boardType": boardType,
      "boardUpdate": boardUpdate,
      "files": changefiles,
    };
    console.log(inputs)
    const json = JSON.stringify(inputs);
    console.log(json)

    await axios.put(
      url,
      json,
      {
        headers : {
          "Content-Type": "application/json",
          'Authorization' : `Bearer ${myId}`
        }
      }
    ).then(res => {
      console.log('보냈다 200번인가?', newFiles)
      if (newFiles.length > 0) {
        console.log('보낸다 미디어', res.data)
        const formData = new FormData()
        newFiles.forEach(f => {
          formData.append('uploadfile', f)
        })
        axios.post(
          url + `files/${boardId}`,
          formData,
          {
            headers : {
              'Content-Type': 'multipart/form-data',
              'Authorization' : `Bearer ${myId}`
            }
          }
        ).then(res => console.log('받았다', res.data)
        ).catch(err => console.log('지긋지긋한 미디어 오류', err))
      }
    })
    .catch(err => console.log('일단 보낸거 같긴한데', err))

    navigation.goBack()
  }

  return (
    <ScrollView
      style={styles.safe}
    >
      <View
        style={{
          alignItems: 'center',
          marginBottom: SCREEN_HEIGHT * 0.01,
        }}
      >
        { files.map(file => {
          if ( file.fileType === 'IMAGE') {
            return (
              <TouchableWithoutFeedback
                key={ file.fileId }
                style={ styles.media }
                onPress={() => {
                  changestatus(file.fileId)
                  // console.log(file.fileId)
                } }
              >
                {/* <Text>{ `http://i7d205.p.ssafy.io/api/file/${file.fileType}/${file.fileName}` }</Text> */}
                <Image
                  source={{ uri: `http://i7d205.p.ssafy.io/api/file/${file.fileType}/${file.fileName}` }}
                  resizeMode="cover"
                  style={{
                    height: SCREEN_WIDTH * 0.8,
                    width: SCREEN_WIDTH * 0.8,
                  }}
                />
              </TouchableWithoutFeedback>
            )
          } else {
            return(
              <TouchableWithoutFeedback
                key={ file.fileId }
                style={ styles.media }
                onPress={() => {
                  changestatus(file.fileId)
                }}
              ><Video
                  source={{ uri: `http://i7d205.p.ssafy.io/api/file/${file.fileType}/${file.fileName}` }}
                  controls={true}
                  style={{
                    height: SCREEN_WIDTH * 0.8,
                    width: SCREEN_WIDTH * 0.8,
                  }}
              /></TouchableWithoutFeedback>
              )
          }
        })}
        { newFiles.length > 0 && 
          newFiles.map(file => {
            if ( file.type === 'image/jpeg') {
              return (
                <View
                  key={ file.fileId }
                  style={ styles.media }
                >
                  <Image
                  source={{ uri: file.uri}}
                  resizeMode="cover"
                  style={{
                    width: file.width,
                    height: file.height,
                    maxHeight: SCREEN_WIDTH * 0.8,
                    maxWidth: SCREEN_WIDTH * 0.8,
                  }}
                />
                </View>
              )
            } else {
              return(
                <View
                  key={ file.fileId }
                  style={ styles.media }
                ><Video
                    source={{ uri: file.uri }}
                    style={{
                      height: SCREEN_WIDTH * 0.8,
                      width: SCREEN_WIDTH * 0.8,
                    }}
                /></View>
                )
            }
          })
        }
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: 'space-evenly',
          marginBottom: SCREEN_HEIGHT * 0.05
        }}
      >

      <Button
        title="갤러리"
        onPressIn={openStorage}
        containerStyle={styles.button}
      />
      </View>
      <Form
        onButtonPress={onSubmit}
        buttonText = "보내기"
        >
        <FormItem
          label="제목"
          value={title}
          returnKeyType="next"
          onChangeText={setTitle}
          placeholder="제목을 입력해주세요"
        />
        <FormItem
          textArea
          label="내용"
          value={content}
          returnKeyType="send"
          placeholder="내용을 입력해주세요"
          onChangeText={setContent}
        />
      </Form>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  safe: {
    paddingVertical: ScreenHeight * 0.05,
    paddingHorizontal: SCREEN_WIDTH * 0.1,
  },
  button: {
    width: SCREEN_WIDTH * 0.2,
  },
  media: {
    marginBottom: SCREEN_HEIGHT * 0.005,
  }
});
export default ChangeFeedScreen