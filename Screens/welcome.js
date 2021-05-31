import React from 'react';
import {View,Text,StyleSheet,Image,TextInput,TouchableOpacity,Alert,KeyboardAvoidingView, Modal, ToastAndroid} from 'react-native';
import * as firebase from 'firebase'
import db from '../config'

export default class Welcome extends React.Component {

    constructor(){
        super();
        this.state={
          emailId : '',
          password: '',
          firstName :'',
          lastName: '',
          address: '',
          contact: '',
          confirmPassword: '',
          isModalVisible: 'false'
        }
      }
    userSignUp = (emailId, password, confirmPassword)=>{
      if(password != confirmPassword){
        return(Alert.alert("Password doesn't match!"))
      }
      else{
        firebase.auth.createUserWithEmailAndPassword(emailId, password)
        .then(()=>{
          db.collection("users").add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            contact: this.state.contact,
            email_Id: this.state.emailId,
            address: this.state.address
          })
          return(ToastAndroid.show("User Added Successfully!",ToastAndroid.SHORT))
        })
        .catch((error)=>{
          return(
            Alert.alert(error.message)
          )
        })
      }
    }
      login=async(email,password)=>{
        if (email && password){
          try{
            const response = await firebase.auth().signInWithEmailAndPassword(email,password)
            if(response){
              this.props.navigation.navigate('Transaction')
            }
          }
          catch(error){
            switch (error.code) {
              case 'auth/user-not-found':
                Alert.alert("user dosen't exists")
                console.log("doesn't exist")
                break
              case 'auth/invalid-email':
                Alert.alert('incorrect email or password')
                console.log('invaild')
                break
            }
          }
        }
        else{
            Alert.alert('enter email and password');
        }
      }
      showModal =()=>{
        return(
          <Modal animationType = "fade" transparent = {true} visible = {this.state.isModalVisible} >
            <TextInput style={styles.formTextInput} placeholder ={"First Name"} maxLength ={8} onChangeText={(text)=>{ this.setState({ firstName: text }) }} />
            <TextInput style={styles.formTextInput} placeholder ={"Last Name"} maxLength ={8} onChangeText={(text)=>{ this.setState({ lastName: text }) }} />
            <TextInput style={styles.formTextInput} placeholder ={"Contact No."} maxLength ={10} onChangeText={(text)=>{ this.setState({ contact: text }) }}keyboardType={'numeric'} />
            <TextInput style={styles.formTextInput} placeholder ={"Email-ID"}onChangeText={(text)=>{ this.setState({ emailId: text }) }}keyboardType={'email-address'} />
            <TextInput style={styles.formTextInput} placeholder ={"Address"} multiline ={true} onChangeText={(text)=>{ this.setState({address: text }) }} />
            <TextInput style={styles.formTextInput} placeholder ={"Password"}  onChangeText={(text)=>{ this.setState({ password: text }) }}secureTextEntry = {true} />
            <TextInput style={styles.formTextInput} placeholder ={"Confirm Password"}  onChangeText={(text)=>{ this.setState({ confirmPassword: text }) }}secureTextEntry = {true} />
          <TouchableOpacity onPress = {this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPassword)}>Submit</TouchableOpacity>
          </Modal>
          
        )
      }

  render(){
      return(

        <KeyboardAvoidingView style = {{alignItems:'center',marginTop:20}}>
        ({this.showModal()})
        <View>
          <Image
            source={require("../assets/logo.png")}
            style={{width:200, height: 200}}/>
          <Text style={{textAlign: 'center', fontSize: 30}}>Wily</Text>
        </View>
        <View>
        <TextInput
          style={styles.loginBox}
          placeholder="xyz@example.com"
          keyboardType ='email-address'
          onChangeText={(text)=>{
            this.setState({
              emailId: text
            })
          }}
        />

        <TextInput
          style={styles.loginBox}
          secureTextEntry = {true}
          placeholder="Enter Password eg,12345"
          onChangeText={(text)=>{
            this.setState({
              password: text
            })
          }}
        />
        </View>
        <View>
          <TouchableOpacity style={{height:30,width:90,borderWidth:1,marginTop:20,paddingTop:5,borderRadius:7}}
          onPress={()=>{this.login(this.state.emailId ,this.state.password)}}>
            <Text style={{textAlign:'center'}}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{height:30,width:90,borderWidth:1,marginTop:20,paddingTop:5,borderRadius:7}}
          onPress={()=>{this.signup(this.state.emailId ,this.state.password)}}>
            <Text onPress={()=>this.setState({ isModalVisible:true})}style={{textAlign:'center'}}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      )
  }
}


const styles = StyleSheet.create({
  loginBox:
  {
    width: 300,
  height: 40,
  borderWidth: 1.5,
  fontSize: 20,
  margin:10,
  paddingLeft:10
  }
})