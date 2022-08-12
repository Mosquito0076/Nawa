import React, { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
} from 'react-native';

import { Form, FormItem } from "react-native-form-component";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import {RootStackParamList} from '../../AppInner';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>

// 사진파일 저장 필요


function SignUp({navigation} : SignUpScreenProps) {
    const dispatch = useAppDispatch();



    // 임시 저장공간 생성
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [nickName, setNickName] = useState('');
    const [number, setNumber] = useState('');
    const [gender, setGender] = useState('');
    const userIdRef = useRef<TextInput | null>(null);
    const passwordRef = useRef<TextInput | null>(null);
    const emailRef = useRef<TextInput | null>(null);
    const nameRef = useRef<TextInput | null>(null);
    const nickNameRef = useRef<TextInput | null>(null);
    const numberRef = useRef<TextInput | null>(null);

    // 아이디 닉네임 중복 / 번호 인증 / 비밀번호 확인test
    const [openId, setOpenId] = useState('');
    const [openNickname, setOpenNickname] = useState('');
    const [authNumber, setAuthNumber] = useState('');
    const authNumberRef = useRef<TextInput | null>(null);
    const [passwordCheck, setPasswordCheck] = useState('')
    const passwordCheckRef = useRef<TextInput | null>(null);
    // 성별 래디오 버튼
    const radio_props = [
      {label: '남성', value: "MAN" },
      {label: '여성', value: "WOMAN" }
    ];

    // 아이디 중복 검사
    const [idCheck, setIdCheck] = useState(false)
    const checkId = async e => {
      setOpenId(e)
      try {
        const response = await axios.get(`http://i7d205.p.ssafy.io:8080/userId/${openId}`, {
        });
        setUserId(openId)
        setIdCheck(true)
        console.log('ID pass', openId, userId)
        Alert.alert('알림', '사용 가능합니다.')
        console.log(response.status)
      }
      catch {
        console.log("ID fail!")
        Alert.alert('알림', '중복입니다.')
      }
    }

    // 닉네임 중복 검사
    const [nicknameCheck, setNicknameCheck] = useState(false)
    const checkNickname = async e => {
      setOpenNickname(e)
      try {
        const response = await axios.get(`http://i7d205.p.ssafy.io:8080/user/nickname/${openNickname}`, {
        });
        setNickName(openNickname)
        setNicknameCheck(true)
        console.log('Nickname pass', nickName)
        Alert.alert('알림', '사용 가능합니다.')
      } catch {
        console.log('Nickname fail!')
        Alert.alert('알림', '중복입니다.')
      }
    }

    // 인증 번호 보내기
    const [sendNumber, setSendNumber] = useState('')
    const sendAuthNumber = async e => {
      setSendNumber(e)
      try {
        const response = await axios.post(`http://i7d205.p.ssafy.io:8080/user/sms`, {
          "recipientPhoneNumber": sendNumber});
        console.log(number)
      }
      catch {
        console.log('not available')
      }
    }
    
    // 인증 번호
    const [authNumberCheck, setAuthNumberCheck] = useState(false)
    const checkAuthNumber = async e => {
      setAuthNumber(e)
      try {
        const response = await axios.post(`http://i7d205.p.ssafy.io:8080/user/sms/check`, {
          "certNumber": authNumber, 
          "recipientPhoneNumber": number});
        console.log("Authentication Pass")
      } 
      catch{
        console.log("retry")
      }
    }
    
  
    // 저장 함수
    const onChangeUserId = useCallback(text => {
        setUserId(text.trim());
    }, []);
    const onChangePassword = useCallback(text => {
        setPassword(text.trim());
    }, []);
    const onChangeEmail = useCallback(text => {
        setEmail(text.trim());
    }, []);
    // const onChangeName = useCallback(text => {
    //     setName(text.trim());
    // }, []);
    const onChangeNickName = useCallback(text => {
        setNickName(text.trim());
    }, []);
    const onChangeNumber = useCallback(text => {
        setNumber(text.trim());
    }, []);
    const onChangeGender = useCallback(text => {
        setGender(text.trim());
    }, []);
    const onChangeAuthNumber = useCallback(text => {
      setAuthNumber(text.trim());
    }, []);
    const onChangePasswordCheck = useCallback(text => {
      setPasswordCheck(text.trim());
  }, []);

    // 제출 처리 | 비동기 await | 유효성 검사
    const onSubmit = useCallback(async () => {
        if (loading) {
            return;
        }
        if (!userId || !userId.trim()) {
            return Alert.alert('ID 나와 !', 'ID를 입력해주세요');
        }
        if (!password || !password.trim()) {
            return Alert.alert('passWord 나와 !', 'passWord를 입력해주세요');
        }
        if (!date) {
            return Alert.alert('생일 나와 !', '생일을 입력해주세요');
        }
        if (!email || !email.trim()) {
            return Alert.alert('email 나와 !', 'email을 입력해주세요');
        }
        // if (!name || !name.trim()) {
        //     return Alert.alert('이름 나와 !', '이름을 입력해주세요');
        // }
        if (!nickName || !nickName.trim()) {
            return Alert.alert('닉네임 나와 !', '닉네임을 입력해주세요');
        }
        if (!number || !number.trim()) {
            return Alert.alert('번호 나와 !', '번호를 입력해주세요');
        }
        if (!userId || !userId.trim()) {
            return Alert.alert('ID 나와 !', 'ID를 입력해주세요');
        }
        if (!gender || !gender.trim()) {
            return Alert.alert('성별 나와 !', '성별을 입력해주세요');
        }
        
        if (
            !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
              email,
            )
        ) {
            return Alert.alert('이메일 나와 !', '올바른 이메일 주소가 아닙니다.');
        }
        if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
            return Alert.alert(
                'PassWord 나와 !',
                '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
            );
        }
        // 유효성 검사 추가 필요
//////////////////////////////////////////////////////////////////// 시작//////////////////////////////////////////
        try {
            setLoading(true);
            console.log(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`)
            const response = await axios.post('http://i7d205.p.ssafy.io:8080/signup', {
                userId : userId,
                password : password,
                birth : `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`,
                emailId : email.split('@')[0],
                emailDomain : email.split('@')[1],
                nickname : nickName,
                number : number,
                genderType : gender,
            }).then(() =>console.log(response));
            Alert.alert('Welcome !', '회원가입 되었습니다.')
            await AsyncStorage.setItem(
              'nickname',
              nickName
            );
            dispatch(
              userSlice.actions.setUser({
                nickname : nickName,
              }),
            )
            
            navigation.navigate('SignIn')
        } catch (error) {
            const errorResponse = (error as AxiosError).response;
            if (errorResponse) {
              console.log(errorResponse.data)
              // Alert.alert('알림', errorResponse);
            }
          } finally {
            setLoading(false);
          }
    }, [loading, navigation, userId, password, date, email, name, nickName, number, gender]);
//////////////////////////////////////////////////////////////////// 끝 //////////////////////////////////////////

    // const canGoNext = userId && password && date && email && name && nickName && number && gender;
    // userId, nickName => id, 닉네임 중복검사
    const canGoNext = idCheck && password && date && email && nicknameCheck && number && gender; 
    return (
      <DismissKeyboardView>
      <View style={styles.viewTop}></View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>아이디</Text>
        <View style={{flex: 1, flexDirection:'row'}}>
          <View style={{flex: 5}}>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangeUserId}
              placeholder="아이디를 입력해주세요"
              placeholderTextColor="#666"
              textContentType="username"
              value={userId}
              returnKeyType="next"
              clearButtonMode="while-editing"
              ref={userIdRef}
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              autoCapitalize= 'none'
            />
          </View>
          <View style={{flex: 2}}>
            <Pressable
              style={styles.checkButton}
              onPress={() => {
                checkId(userId)
              }}>
              <Text style={styles.loginButtonText}>{ idCheck ? '통과완료' : '중복검사'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
          placeholderTextColor="#666"
          onChangeText={onChangePassword}
          value={password}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={() => passwordCheckRef.current?.focus()}
          autoCapitalize= 'none'
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
          placeholderTextColor="#666"
          onChangeText={onChangePasswordCheck}
          value={passwordCheck}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordCheckRef}
          onSubmitEditing={() => 
            password === passwordCheck ? 
            emailRef.current?.focus() 
            : Alert.alert('알람', '비밀번호와 다릅니다. \n확인이 필요합니다.')
          }
          autoCapitalize= 'none'
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>생일</Text>
        <View style={{flex: 1, flexDirection: "row"}}>
          <View style={{flex: 5}}>
            <Text style={styles.textBirth}>{date.getFullYear()} / {date.getMonth()+1} / {date.getDate()}</Text>
          </View>
          <View style={{flex: 2}}>
            <Pressable
                style={styles.checkButton}
                onPress={() => setOpen(true)}>
                <Text style={styles.loginButtonText}>달력 열기</Text>
              </Pressable>
            <DatePicker
                modal
                locale="ko"
                open={open}
                date={date}
                mode="date"
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
          </View>
        </View>
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeEmail}
          placeholder="이메일을 입력해주세요"
          placeholderTextColor="#666"
          textContentType="emailAddress"
          value={email}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => nameRef.current?.focus()}
          blurOnSubmit={false}
          autoCapitalize= 'none'
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>닉네임</Text>
        <View style={{flex: 1, flexDirection:'row'}}>
          <View style={{flex: 5}}>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangeNickName}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor="#666"
              textContentType="username"
              value={nickName}
              returnKeyType="next"
              clearButtonMode="while-editing"
              ref={nickNameRef}
              onSubmitEditing={() => numberRef.current?.focus()}////
              blurOnSubmit={false}
              autoCapitalize= 'none'
            />
          </View>
          <View style={{flex: 2}}>
            <Pressable
              style={styles.checkButton}
              onPress={() => checkNickname(nickName)}>
              <Text style={styles.loginButtonText}>{ nicknameCheck ? '통과 완료' : '중복 검사'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>전화번호</Text>
        <View style={{flex: 1, flexDirection:'row'}}>
          <View style={{flex: 5}}>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangeNumber}
              placeholder="전화번호를 입력해주세요"
              placeholderTextColor="#666"
              textContentType="telephoneNumber"
              value={number}
              returnKeyType="next"
              clearButtonMode="while-editing"
              ref={numberRef}
              // onSubmitEditing={() => genderRef.current?.focus()}
              blurOnSubmit={false}
              autoCapitalize= 'none'
              keyboardType= "number-pad"
            />
          </View>
          <View style={{flex: 2}}>
            <Pressable
              style={styles.checkButton}
              onPress={() => sendAuthNumber(number)}>
              <Text style={styles.loginButtonText}>인증 문자</Text>
            </Pressable>
          </View>
        </View>
        <View style={{flex: 1, flexDirection:'row', marginVertical: 12}}>
          <View style={{flex: 5}}>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangeAuthNumber}
              placeholder="인증번호를 입력해주세요"
              placeholderTextColor="#666"
              textContentType="telephoneNumber"
              value={authNumber}
              returnKeyType="next"
              clearButtonMode="while-editing"
              ref={authNumberRef}
              blurOnSubmit={false}
              autoCapitalize= 'none'
              keyboardType= "number-pad"
            />
          </View>
          <View style={{flex: 2}}>
            <Pressable
              style={styles.checkButton}
              onPress={() => checkAuthNumber(authNumber)}>
              <Text style={styles.loginButtonText}>번호 인증</Text>
            </Pressable>
          </View>
        </View>       
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>성별</Text>
        {/* <RadioForm
          radio_props={radio_props}
          initial={"남성"}
          buttonColor={"gray"}
          formHorizontal={true}
          onPress={
            (value : string) => {setGender(value)
            console.log("value: ", value)
            }}
        /> */}
        <RadioForm
          formHorizontal={true}
          animation={true}
        >
          {
            radio_props.map((obj, i) => (
              <RadioButton labelHorizontal={true} key={i} >
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={gender === obj.value}
                  onPress={
                    (value : string) => {setGender(value)
                      console.log("value: ", value)}
                    }
                  borderWidth={1}
                  buttonInnerColor={'gray'}
                  buttonOuterColor={gender === obj.value ? '#2196f3' : '#000'}
                  buttonSize={10}
                  buttonOuterSize={20}
                  buttonStyle={{}}
                  buttonWrapStyle={{marginLeft: 10}}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  onPress={
                    (value : string) => {setGender(value)
                      console.log("value: ", value)}
                    }
                  labelStyle={{fontSize: 17, color: 'black', marginRight: 60}}
                  labelWrapStyle={{}}
                />
              </RadioButton>
          ))}
        </RadioForm>
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(styles.loginButtonForm, styles.loginButtonActiveForm)
              : styles.loginButtonForm
          }
          disabled={!canGoNext || loading}
          onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </DismissKeyboardView>
      );
    }
    
    const styles = StyleSheet.create({
      textInput: {
        padding: 5,
        borderWidth: 1,
      },
      textBirth:{
        padding: 5,
        borderWidth: 1,
        height: 40,
        textAlign: "center",
        textAlignVertical: "center",
      },
      inputWrapper: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 20,
      },
      label: {
        fontWeight: '600',
        fontSize: 16,
        color : 'black',
        marginBottom: 10,
        marginLeft: 10,
      },
      buttonZone: {
        alignItems: 'center',
      },
      checkButton: {
        backgroundColor: '#A0A0A0',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginLeft: 5,
      },
      loginButtonText: {
        color: 'white',
        fontSize: 16,
      },
      loginButtonForm: {
        backgroundColor: '#C0C0C0',
        paddingHorizontal: 128,
        paddingVertical: 10,
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        marginTop: 10,
        borderWidth: 1,
      },
      loginButtonActiveForm: {
        backgroundColor: '#00aeff',
      },
      viewTop :{
        marginTop: 30,
      }
    });
    
    export default SignUp;
