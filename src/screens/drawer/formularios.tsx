
import React, { useState } from 'react';
import { View, Alert, ScrollView, Text, TextInput, Pressable, StyleSheet, RefreshControl, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import axios from 'axios';

export default function Forms() {
    const [refreshing, setRefreshing] = useState(false);
    const [pais, setPais] = useState('')
    const [formularios, setFormularios] = useState([])

    const [selectedValue, setSelectedValue] = useState('');

    async function buscarForms() {
        try {
            const url = pais
                ? `http://192.168.0.3:5030/formulario/${pais}`
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

            <Text style={styles.label}>Selecione uma opção:</Text>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Opção 1" value="opcao1" />
                <Picker.Item label="Opção 2" value="opcao2" />
                <Picker.Item label="Opção 3" value="opcao3" />
            </Picker>
            <Text style={styles.selectedText}>Selecionado: {selectedValue}</Text>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 25,
        color: '#FFF',
        fontWeight: '900',

        backgroundColor: '#665441',
        width: '100%',

        textAlign: 'center',
        paddingVertical: 10,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: 200,
    },
    selectedText: {
        fontSize: 16,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#A6896B',
        paddingHorizontal: 50,
        paddingVertical: 8,
        marginTop: 40,
        marginBottom: 50,
        fontSize: 18,
        color: '#FFF',
        borderRadius: 100,
    },
});