
import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, Text, TextInput, Pressable, StyleSheet, RefreshControl, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

import axios from 'axios';

interface Formulario {
    id: number;
    cliente: string;
    email: string;
    telefone: string;
    pais: string;
    mensagem: string;
    dia: string;
}

export default function Forms() {
    const [refreshing, setRefreshing] = useState(false);
    const [formularios, setFormularios] = useState<Formulario[]>([]);

    const [selectedValue, setSelectedValue] = useState('');

    async function buscarForms() {
        try {
            const url = selectedValue != 'Todos'
                ? `http://192.168.0.3:5030/formulario/${selectedValue}`
                : `http://192.168.0.3:5030/formulario`
            let resp = await axios.get(url)

            setFormularios(resp.data)
        }
        catch (err) {

        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        buscarForms()
        setRefreshing(false);
    };

    useEffect(() => {
        buscarForms();
    }, [selectedValue]);

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
            <View>
                <Text style={styles.label}>Selecione um País:</Text>
                <View style={{
                    borderColor: '#000',
                    borderWidth: 1,
                    marginTop: 10,
                    width: '100%',
                    alignSelf: 'center'
                }}>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Brasil" value="Brasil" />
                        <Picker.Item label="Estados Unidos" value="Estados Unidos" />
                        <Picker.Item label="Irlanda do Norte" value="Irlanda do Norte" />
                        <Picker.Item label="Irlanda do Sul" value="Irlanda do Sul" />
                        <Picker.Item label="Todos" value="Todos" />
                    </Picker>
                </View>

                <View style={{
                    marginTop: 30,
                    alignSelf: 'center',
                }}>
                    {formularios.map((item) => (
                        <View style={styles.form} key={item.id}>
                            <Text style={styles.formTitle}>Formulário {item.id}</Text>

                            <View style={styles.formLabelBox}>
                                <Ionicons name="person-outline" size={24} color="white" />
                                <Text style={styles.formLabel}>{item.cliente}</Text>
                            </View>

                            <View style={styles.formLabelBox}>
                                <Ionicons name="mail-outline" size={24} color="white" />
                                <Text style={styles.formLabel}>{item.email}</Text>
                            </View>

                            <View style={styles.formLabelBox}>
                                <Feather name="phone" size={22} color="white" />
                                <Text style={styles.formLabel}>{item.telefone}</Text>
                            </View>

                            <View style={styles.formLabelBox}>
                                <Feather name="map-pin" size={24} color="white" />
                                <Text style={styles.formLabel}>{item.pais}</Text>
                            </View>

                            <View style={styles.formLabelBox}>
                                <AntDesign name="edit" size={24} color="white" />
                                <Text style={styles.formLabel}>{item.mensagem}</Text>
                            </View>

                            <View style={styles.formLabelBox}>
                                <Feather name="calendar" size={24} color="white" />
                                <Text style={styles.formLabel}>{new Date(item.dia).toLocaleDateString()}</Text>
                            </View>

                            <View style={styles.formLabelBox}>
                                <Feather name="clock" size={24} color="white" />
                                <Text style={styles.formLabel}>{new Date(item.dia).toLocaleTimeString()}</Text>
                            </View>

                        </View>
                    ))}
                </View>
            </View>


        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    label: {
        marginTop: 20,
        fontSize: 20,
    },
    picker: {
        height: 50,
        width: 200,
    },
    form: {
        backgroundColor: '#44392D',
        width: 290,
        borderRadius: 20,
        alignItems: 'center',
        gap: 10,
        marginBottom: 30,
        paddingBottom: 20
    },
    formTitle: {
        fontSize: 25,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        padding: 15,
    },
    formLabelBox: {
        alignItems: 'center',
        backgroundColor: '#8A7660',
        width: '90%',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        borderWidth: 0.1,
    },
    formLabel: {
        color: '#FFF',
        fontSize: 14
    }
});