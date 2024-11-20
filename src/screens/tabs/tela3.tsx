import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, TextInput, KeyboardAvoidingView, ScrollView, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Tela3 = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // Estado para armazenar a imagem
    const [Tipo, setTipo] = useState('');
    const [Local, setLocal] = useState('');

    // Função para selecionar a imagem
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;

            // Converter a imagem para base64
            const base64Image = await fetch(uri)
                .then(res => res.blob())
                .then(blob => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }));

            setSelectedImage(base64Image); // Atualiza o estado com a imagem em base64
        }
    };

    // Função para enviar a imagem à API
    const sendImage = async () => {
        if (!selectedImage) {
            Alert.alert('Erro', 'Nenhuma imagem selecionada para enviar.');
            return;
        }

        try {
            const response = await fetch('http://192.168.0.3:5030/projeto/andamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imagem: selectedImage,
                    tipo: Tipo,
                    local: Local,
                }),
            });

            const data = await response.json();
            Alert.alert('Sucesso', `Projeto em Andamento enviado com sucesso. Id: ${data.novoId}`);
            console.log('Projeto em Andamento enviado:', data.novoId);
        } catch (error) {
            Alert.alert('Erro', 'Erro ao enviar o Projeto em Andamento.');
            console.error('Erro ao enviar o Projeto em Andamento:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.innerContainer}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Button title="Escolher Imagem" onPress={pickImage} />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o Tipo"
                        onChangeText={setTipo}
                        value={Tipo}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o Local"
                        onChangeText={setLocal}
                        value={Local}
                    />

                    {selectedImage ? (
                        <>
                            <Image source={{ uri: selectedImage }} style={styles.image} />
                            <Button title="Enviar Projeto em Andamento" onPress={sendImage} />
                        </>
                    ) : (
                        <Text style={styles.placeholder}>Nenhuma imagem selecionada</Text>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20, 
    },
    image: {
        marginTop: 20,
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    placeholder: {
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
    input: {
        marginTop: 20,
        width: 200,
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});

export default Tela3;
