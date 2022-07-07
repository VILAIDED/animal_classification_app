import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native"
import { useEffect, useRef, useState, } from "react";
import colors from "../assets/colors";
import RNFS from 'react-native-fs'
import { launchImageLibrary } from 'react-native-image-picker';
const Home = () => {
    const socketRef = useRef()
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)
    const [label, setLabel] = useState('')
    const uploadImage = () => {
        launchImageLibrary({ noData: true ,quality : 0.7}, (res) => {
           
            if (!res.didCancel) {
                const img  = res.assets[0]
                setImage(img)
                RNFS.readFile(img.uri, 'base64').then(data=>{
                    console.log(data)
                    socketRef.current.send(`IMAGE*/${data}`)
                    setLabel('wait a second...')
                })
              
               
            }
        })
    }
    useEffect(() => {
        if (socketRef.current == null) {
            socketRef.current = new WebSocket('ws://192.168.241.203:5001')
        }
        socketRef.current.onopen = () => {
            socketRef.current.send('INIT_CLIENT')
        }
        socketRef.current.onmessage = msg => {
            const data = JSON.parse(msg.data)
            let lb = data['label']
            lb = lb[0].toUpperCase() + lb.slice(1);
            setLabel(lb)
        }
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={styles.titleContainer}>

                    <Image
                        style={styles.iconImage}
                        source={require('../assets/icons/cat.png')} />

                    <Text style={styles.titleText}>Meow's world</Text>

                </View>
                <View style={styles.content}>


                    <Text style={{ fontFamily: 'AB', fontSize: 15, textAlign: 'center' ,color : colors.third}}> Animal image classification using cnn</Text>

                    <TouchableOpacity
                        onPress={() => { uploadImage()}}>
                        <View style={styles.imageContainer}>
                            {image ? <Image
                                style={[styles.imageUp,{resizeMode: 'contain'}]}
                                source={{uri : image.uri}}
                                
                                 />
                                :
                                <View style={styles.emptyImage}>
                                    <Image
                                        style={styles.iconImage}
                                        source={require('../assets/icons/meow.png')} />
                                    <Text style={{ fontFamily: 'AB', fontSize: 20 }}>upload your image to predict here </Text></View>}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.labelText}>{label}</Text>
                </View>
                <Text style={{ fontFamily: 'AB', fontSize: 9, marginVertical: 10, flex: 0.1, textAlign: 'right' ,color : colors.fourth}}> just boring app from someone who just boring :)</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.first,
        flex: 1
    },
    mainContainer: {

        margin: 20,
        flex: 1,

        flexDirection: 'column'
    },
    content: {

        justifyContent: 'center',
        flex: 0.6,
        marginBottom: 20


    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.15
    },
    icon: {
        flexDirection: 'column'
    },
    imageUp : {
        width: "100%",
        height: "100%",
    },
    iconImage: {
        width: 50,
        height: 50,
        marginHorizontal: 10
    },
    imageContainer: {
        backgroundColor: colors.fourth,
        opacity: 88,
        borderRadius: 5,
        height: Dimensions.get('window').height * 0.3,
        justifyContent: "center",
        marginVertical: 20
    },
    emptyImage: {
        flexDirection: 'column',
        alignItems: 'center',
      
      
    },
    titleText: {
        fontFamily: 'AB'
    },
    labelText: {
        alignSelf: 'center',
        fontFamily: 'AB',
        fontSize: 30,
        color : colors.third
    }

})
export default Home;