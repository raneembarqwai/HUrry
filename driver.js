
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

 
const driver= ({ navigation }) =>{
const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header with a design line */}
      <View style={styles.header}>
        <Text style={styles.headerText}>ASPT-HU</Text>
        </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Side Menu */}
        <View style={[styles.menuContainer,menuVisible && styles.menuContainerExpanded]}>
          <TouchableOpacity
            style={styles.menuToggleButton}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Text style={styles.menuToggleText}>الخيارات</Text>
          </TouchableOpacity>
          {menuVisible && (
            <View style={styles.menuOptions}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Page1')}
              >
                <Text style={styles.menuText}>Option 1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Page2')}
              >
                <Text style={styles.menuText}>Option 2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Page3')}
              >
                <Text style={styles.menuText}>Option 3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Page4')}
              >
                <Text style={styles.menuText}>Option 4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Page5')}
              >
                <Text style={styles.menuText}>Option 5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Page6')}
              >
                <Text style={styles.menuText}>Option 6</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Page7')}
              >
                <Text style={styles.menuText}>Option 7</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Center Content */}
        <View style={styles.imageContainer}>
          <Image
           // source={{ uri: 'https://via.placeholder.com/150' }}
           source={{ uri: 'https://img.freepik.com/premium-vector/map-with-destination-location-color-point_34645-933.jpg' }}
            style={styles.image}
          />
        </View>
      </View>
      <View style={styles.lowerHalf}>
      <View style={styles.row}>
        {/* الأزرار الأربعة الأولى في الصف العلوي */}
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Button 1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Button 2</Text></TouchableOpacity>
        
      </View>

      <View style={styles.row}>
        {/* الأزرار الأربعة الثانية في الصف السفلي */}
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Button 5</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Button 6</Text></TouchableOpacity>
        
      </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.headerText}>  </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  footer:{
    backgroundColor: '#ADD8E6',
    padding: 20,
    alignItems: 'center',
    position:'absolute',
    bottom:0,
    width:'100%',
  },
  lowerHalf:{
    flex:6.5,
    justifyContent:'center',
    alignItems:'center',
  },
  row:{
flexDirection:'row',
justifyContent:'space-evenly',
width:'80%',
marginVertical:10,

  },
  button:{
backgroundColor:'#5F9AE0',
paddingVertical:15,
paddingHorizontal:30,
borderRadius:5,
  },
buttonText:{
color:'white',
fontSize:16,

},
  header: {
    backgroundColor: '#ADD8E6',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexDirection: 'row-reverse',
    flex:1,
    textAlign:'right',
    fontWeight:'bold',
    writingDirection:'rt1',
  },
  menuContainer: {
    position:'absolute',
    zIndex:1,
    width: '20%',
    backgroundColor: '#8080801A',
    top:0,
    right:0,
    padding: 10,
    textAlign:'right',
    borderRadius: 5,
    writingDirection:'rt1',
    
  },
  menuContainerExpanded: {
    width: '50%',
    backgroundColor: '#ADD8E6',
    padding: 10,
    textAlign:'right',
    right:0,
    writingDirection:'rt1',
  },
  menuButton: {
    backgroundColor: '#5F9AE0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 7,
    right:0,
    textAlign:'right',
    fontWeight:'bold',
    writingDirection:'rt1',
  },
  menuText: {
    color: '#fff',
    fontWeight:'bold',
    right:0,
    textAlign:'right',
    writingDirection:'rt1',
  },
  menuToggleText: {
    color: 'black',
    fontWeight:'bold',
    right:0,
    textAlign:'right',
    writingDirection:'rt1',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  image: {
    width: 390,
    height: 260,
    borderRadius: 10,
  },
});

export default driver;