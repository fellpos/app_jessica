import React, { useState } from 'react';
import { View, Alert, ScrollView, Text, TextInput, Pressable, StyleSheet, RefreshControl, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Entypo from '@expo/vector-icons/Entypo';

import axios from 'axios';

export default function Tela2() {
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');
    const [contatoCliente, setContatoCliente] = useState('');
    const [dataInicio, setDataInicio] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tipoProjeto, setTipoProjeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorTotalEstimado, setValorTotalEstimado] = useState('');
    const [valorPago, setValorPago] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('');

    const [descricaoTarefa, setDescricaoTarefa] = useState('')
    const [idProjeto, setIdProjeto] = useState('')

    const [refreshing, setRefreshing] = useState(false);

    async function InserirProjeto() {
        if (nomeProjeto && nomeCliente && contatoCliente && dataInicio && tipoProjeto && descricao && valorTotalEstimado && valorPago && formaPagamento) {

            const valorTotal = parseFloat(valorTotalEstimado.replace(/,/g, '.'));
            const valorPagoFormatado = parseFloat(valorPago.replace(/,/g, '.'));

            const paramCorpo = {
                nome: nomeProjeto,
                cliente: nomeCliente,
                contato: contatoCliente,
                inicio: dataInicio.toISOString().split('T')[0],
                tipo: tipoProjeto,
                descricao,
                valor: valorTotal,
                pago: valorPagoFormatado,
                pagamento: formaPagamento,
            };

            try {
                const url = `http://4.172.207.208:5030/projeto`;
                const resp = await axios.post(url, paramCorpo);

                setNomeProjeto('');
                setNomeCliente('');
                setContatoCliente('');
                setDataInicio(new Date());
                setTipoProjeto('');
                setDescricao('');
                setValorTotalEstimado('');
                setValorPago('');
                setFormaPagamento('');

                Alert.alert('Sucesso', `Projeto adicionado. Id: ${resp.data.novoId}`);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível inserir o projeto.');
            }
        } else {
            Alert.alert('Erro', 'Preencha todos os campos solicitados.');
        }
    };

    async function InserirTarefa() {
        if (descricaoTarefa != '' && idProjeto != '') {
            let tarefa = {
                descricao: descricaoTarefa,
                projeto: idProjeto
            }
            const url = `http://4.172.207.208:5030/tarefa`
            let resp = await axios.post(url, tarefa)

            setDescricaoTarefa('')
            setIdProjeto('')
            Alert.alert('Sucesso', `Nova Tarefa adcionada. Id: ${resp.data.novoId}`)
        } else {
            let mensagem = 'Preencha os campos solicitados'
            alert(mensagem)
        }
    }

    function LimparCampos() {
        setNomeProjeto('');
        setNomeCliente('');
        setContatoCliente('');
        setDataInicio(new Date());
        setTipoProjeto('');
        setDescricao('');
        setValorTotalEstimado('');
        setValorPago('');
        setFormaPagamento('');

        setDescricaoTarefa('')
        setIdProjeto('')
    }

    const onRefresh = () => {
        setRefreshing(true);
        LimparCampos()
        setRefreshing(false);
    };

    const onDateChange = (event: { type: string; }, selectedDate: any) => {
        setShowDatePicker(false);
        if (event?.type === 'set' && selectedDate) { // Verifica se a data foi confirmada
            setDataInicio(selectedDate);
        }
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
            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Nome do Projeto:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Projeto 01, 02..."
                    onChangeText={setNomeProjeto}
                    value={nomeProjeto}
                />
            </View>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Nome do Cliente:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Fulano..."
                    onChangeText={setNomeCliente}
                    value={nomeCliente}
                />
            </View>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Contato do Cliente:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+12 (34) 56789..."
                    onChangeText={setContatoCliente}
                    value={contatoCliente}
                />
            </View>

            <View style={styles.dataInputBox}>
                <Text style={styles.inputLabel}>Data de Início:</Text>
                <Pressable onPress={() => setShowDatePicker(true)} style={styles.dataInput}>
                    <Text>{dataInicio.toLocaleDateString()}</Text>
                    <Entypo name="calendar" size={24} color="black" />
                </Pressable>
                {showDatePicker && (
                    <DateTimePicker
                        value={dataInicio}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={onDateChange}
                    />
                )}
            </View>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Tipo do Projeto:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o tipo do projeto"
                    onChangeText={setTipoProjeto}
                    value={tipoProjeto}
                />
            </View>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Descrição do Projeto:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite a descrição"
                    onChangeText={setDescricao}
                    value={descricao}
                />
            </View>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Valor Total Estimado:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o valor total estimado"
                    onChangeText={setValorTotalEstimado}
                    value={valorTotalEstimado}
                />
            </View>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Valor Pago:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o valor pago"
                    onChangeText={setValorPago}
                    value={valorPago}
                />
            </View>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Forma de Pagamento:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite a forma de pagamento"
                    onChangeText={setFormaPagamento}
                    value={formaPagamento}
                />
            </View>

            <Pressable onPress={InserirProjeto}>
                <Text style={styles.button}>INSERIR PROJETO</Text>
            </Pressable>

            <Text style={styles.title}>Nova Tarefa</Text>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Descrição:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Terminar de escrev..."
                    onChangeText={setDescricaoTarefa}
                    value={descricaoTarefa}
                />
            </View>

            <View style={styles.inputs}>
                <Text style={styles.inputLabel}>Id do Projeto:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="2..."
                    onChangeText={setIdProjeto}
                    value={idProjeto}
                />
            </View>

            <Pressable onPress={InserirTarefa}>
                <Text style={styles.button}>INSERIR TAREFA</Text>
            </Pressable>
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
    input: {
        width: 300,
        borderColor: '#665441',
        borderWidth: 2,
        borderRadius: 5,

        backgroundColor: '#FFF',
        paddingHorizontal: 10,
    },
    inputs: {
        marginTop: 20,
    },
    dataInputBox: {
        marginTop: 20,
        width: 160,
        borderWidth: 0.1,
    },
    dataInput: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',

        borderRadius: 5,
        borderColor: '#665441',
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        marginTop: 10,
    },
    inputLabel: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 5,
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