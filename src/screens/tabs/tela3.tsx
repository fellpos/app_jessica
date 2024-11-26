import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, Alert, TextInput, ScrollView, Pressable, RefreshControl } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

import axios from 'axios';

export default function Tela3() {
    const [Imagem, setImagem] = useState<string | null>(null);
    const [Tipo, setTipo] = useState('');
    const [Local, setLocal] = useState('');

    const [IdRecente, setIdRecente] = useState(0);
    const [ImagemRecente, setImagemRecente] = useState<string | null>(null);
    const [TipoRecente, setTipoRecente] = useState('');
    const [LocalRecente, setLocalRecente] = useState('');

    const [editando, setEditando] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const base64Image = await fetch(uri)
                .then(res => res.blob())
                .then(blob => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }));
            setImagem(base64Image);
        }
    };

    async function Inserir() {
        if (!Imagem) {
            Alert.alert('Erro', 'Nenhuma imagem selecionada para enviar.');
            return;
        }

        try {
            const response = await fetch('http://4.172.207.208:5030/projeto/andamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imagem: Imagem,
                    tipo: Tipo,
                    local: Local,
                }),
            });

            const data = await response.json();
            Alert.alert('Sucesso', `Projeto enviado com sucesso. Id: ${data.novoId}`);
            setImagem('');
            setTipo('');
            setLocal('');
        } catch (error) {
            Alert.alert('Erro', 'Erro ao enviar o Projeto.');
        }
    };

    async function ConsultarRecente() {
        try {
            const url = `http://4.172.207.208:5030/projeto/andamento/recente`;
            const resp = await axios.get(url);

            const dados = resp.data;
            setIdRecente(dados.id);
            setImagemRecente(dados.imagem);
            setTipoRecente(dados.tipo);
            setLocalRecente(dados.local);
        } catch (err) {
            setImagemRecente('')
        }
    };

    async function consultarPorId() {
        try {
            const url = `http://4.172.207.208:5030/projetos/andamento/${IdRecente}`;
            const resp = await axios.get(url);

            let dados = resp.data;

            setImagem(dados.imagem);
            setTipo(dados.tipo);
            setLocal(dados.local);

        } catch (err) {

        }
    }

    async function Deletar() {
        try {
            const url = `http://4.172.207.208:5030/projeto/andamento/${IdRecente}`;
            await axios.delete(url);

            Alert.alert('Sucesso', `Deletado com Sucesso`)
            ConsultarRecente()
        }
        catch (err) {
            Alert.alert('ERRO', 'Nenhum registro encontrado')
            setImagemRecente('');
            setTipoRecente('');
            setLocalRecente('');
        }
    }

    async function Alterar() {
        try {

            const response = await fetch('http://4.172.207.208:5030/projeto/andamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imagem: Imagem,
                    tipo: Tipo,
                    local: Local,
                }),
            });

            Alert.alert('Sucesso', `Editado com Sucesso`)

            setEditando(false);
            setImagem('');
            setTipo('');
            setLocal('');
            ConsultarRecente();
        }
        catch (err) {
            Alert.alert('Erro', 'Erro desconhecido ao alterar projeto');
        }
    }

    function LimparCampos() {
        setEditando(false);
        setImagem('');
        setTipo('');
        setLocal('');
        ConsultarRecente();
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await ConsultarRecente();
        LimparCampos()
        setRefreshing(false);
    };

    useEffect(() => {
        ConsultarRecente();
    }, []);


    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#007AFF']} // Cor no Android
                    tintColor="#007AFF" // Cor no iOS
                />
            }
        >
            <Pressable onPress={pickImage}>
                <View style={styles.imageBox}>
                    {Imagem && <Image source={{ uri: Imagem }} style={styles.imagem} />}
                    {Imagem ?
                        <>
                            <MaterialCommunityIcons name="image-edit-outline" size={74} color="white" style={styles.imageIcon} />
                        </>
                        :
                        <>
                            <FontAwesome6 name="image" size={74} color='black' style={styles.imageIcon} />
                        </>
                    }

                </View>
            </Pressable>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>TIPO:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Casa, Apartamento..."
                    onChangeText={setTipo}
                    value={Tipo}
                />
            </View>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>LOCAL:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="São Paulo - Brasil..."
                    onChangeText={setLocal}
                    value={Local}
                />
            </View>

            <Pressable onPress={editando ? Alterar : Inserir}>
                <Text style={styles.button}>{editando ? 'ALTERAR' : 'INSERIR'}</Text>
            </Pressable>

            <View style={styles.previewTitleBox}>
                <Text style={styles.previewTitle}>Pré-Visualização</Text>
            </View>

            {ImagemRecente ?
                (
                    <>
                        <View style={styles.latestImageBox}>
                            <Image source={{ uri: ImagemRecente }} style={styles.imagem} />
                        </View>
                        <View style={styles.previewText}>

                            <Text style={styles.inputLabel}>TIPO: {TipoRecente != null ?
                                TipoRecente
                                :
                                ''
                            }</Text>

                            <View style={styles.previewLocal}>
                                <Text style={styles.inputLabel}>LOCAL: {LocalRecente != null ?
                                    LocalRecente
                                    :
                                    ''
                                }</Text>
                            </View>

                            <Pressable style={styles.previewIcons}>
                            
                                <FontAwesome name="trash" size={54} color="black" onPress={Deletar} />
                                <Feather name="edit" size={50} color="black" onPress={() => {
                                    consultarPorId()
                                    setEditando(true)
                                }} />
                            </Pressable>
                        </View>
                    </>
                )
                :
                (
                    <>
                        <View style={{
                            paddingTop: 30,
                            paddingBottom: 30
                        }}>
                            <Text style={styles.notFound}>Nenhum projeto em andamento no momento</Text>
                        </View>
                    </>
                )
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    image: {
        marginTop: 20,
        width: 200,
        height: 100,
    },
    input: {
        width: 300,
        borderColor: '#665441',
        borderWidth: 2,
        borderRadius: 5,
        padding: 12,
        height: 50,
        backgroundColor: '#FFF'
    },
    inputs: {
        marginTop: 20,
    },
    inputLabel: {
        fontSize: 18,
        marginBottom: 5,
    },
    imagem: {
        width: '105%',
        height: '105%',
    },
    imageBox: {
        width: 250,
        height: 150,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginTop: 40,
        overflow: 'hidden'
    },
    imageIcon: {
        position: 'absolute'
    },
    button: {
        backgroundColor: '#A6896B',
        paddingHorizontal: 50,
        paddingVertical: 8,
        marginTop: 20,
        fontSize: 18,
        color: '#FFF',
        borderRadius: 100,
    },
    latestImageBox: {
        width: 300,
        height: 180,
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginTop: 40,
        overflow: 'hidden',
    },
    previewTitleBox: {
        backgroundColor: '#665441',
        alignItems: 'center',
        borderColor: '#f0f0f0',
        marginTop: 40,
    },
    previewTitle: {
        color: '#FFF',
        width: '100%',
        fontSize: 30,
        paddingHorizontal: 60,
        paddingVertical: 10,
    },
    previewText: {
        width: 300,
    },
    previewLocal: {
        paddingLeft: '50%',
    },
    previewIcons: {
        marginTop: 10,
        justifyContent: 'flex-end',
        borderWidth: 0.1,
        flexDirection: 'row',
        gap: 10
    },
    notFound: {
        backgroundColor: '#d9d9d9',
        color: '#000',
        width: '100%',
        paddingVertical: 50,
        padding: 10,
        borderRadius: 10
    }
});