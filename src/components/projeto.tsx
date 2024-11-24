import React, { useState, useEffect } from 'react';
import { TextInput, Alert, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';

import { Feather } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AccordionProps {
    nome: string;
    id: string;
    cliente: string;
    tipo: string;
    data: string;
    contato: string;
    descricao: string;
    valor: number;
    pago: number;
    refreshToggle: boolean; // Novo prop para fechar os detalhes
}

interface TarefaType {
    descricao: string;
    id: number;
}

const Projeto: React.FC<AccordionProps> = ({ nome, id, cliente, tipo, data, contato, descricao, valor, pago, refreshToggle }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [tarefas, setTarefas] = useState<TarefaType[]>([]);

    const [nomeProjeto, setNomeProjeto] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');
    const [contatoCliente, setContatoCliente] = useState('');
    const [dataInicio, setDataInicio] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tipoProjeto, setTipoProjeto] = useState('');
    const [descricaoProjeto, setDescricaoProjeto] = useState('');
    const [valorTotalEstimado, setValorTotalEstimado] = useState('');
    const [valorPago, setValorPago] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('');

    const [editando, setEditando] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const formatData = (date: string) => {
        if (!date) { // Verifica se a data é undefined ou null
            return 'Data inválida';
        }
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) { // Verifica se a data é válida
            return 'Data inválida';
        }
        return formattedDate.toLocaleDateString('pt-BR');
    };

    async function buscarTarefas() {
        try {
            const url = `http://4.172.207.208:5030/tarefa/${id}`;
            const resp = await axios.get(url);
            const dados = resp.data;
            setTarefas(dados);
        } catch (err) {
            console.error(err);
        }
    }

    const consultarProjetoPorId = async () => {
        try {
            const url = `http://4.172.207.208:5030/projeto/${id}`;
            const resp = await axios.get(url);
            let dados = resp.data;
            let infos = dados[0];

            setNomeProjeto(infos.nome);
            setNomeCliente(infos.cliente);
            setContatoCliente(infos.contato);

            const dataIniciada = new Date(infos.inicio);
            if (!isNaN(dataIniciada.getTime())) {
                setDataInicio(dataIniciada);
            } else {
                setDataInicio(new Date()); // Define uma data atual se a data retornada for inválida
            }

            setTipoProjeto(infos.tipo);
            setDescricaoProjeto(infos.descricao);
            setValorTotalEstimado(infos.valor);
            setValorPago(infos.pago);
            setFormaPagamento(infos.pagamento);
        } catch (err) {
            console.error(err);
        }
    };

    async function Deletar() {
        try {
            const url = `http://4.172.207.208:5030/projeto/${id}`;
            const resp = await axios.delete(url);

            if (resp.status === 200) {
                Alert.alert('Sucesso', `Id: ${id} deletado com sucesso
Carregue novamente a página.`);
                setIsOpen(false);
            }
        } catch (err) {
            const errorMessage = 'Erro desconhecido';
            Alert.alert('Erro', errorMessage);
        }
    }

    const onDateChange = (event: { type: string; }, selectedDate: any) => {
        setShowDatePicker(false);
        if (event?.type === 'set' && selectedDate) { // Verifica se a data foi confirmada
            setDataInicio(selectedDate);
        }
    };

    async function alterarProjeto() {
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
                const url = `http://4.172.207.208:5030/projeto/${id}`;
                const resp = await axios.put(url, paramCorpo);

                setEditando(false)
                Alert.alert('Sucesso', `Projeto alterado.
Carregue novamente a página.`);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível alterar o projeto.');
            }
        } else {
            Alert.alert('Erro', 'Preencha todos os campos solicitados.');
        }
    };

    useEffect(() => {
        buscarTarefas();
        setEditando(false)
        setIsOpen(false); // Fecha os detalhes ao carregar a tarefa
    }, [id]);

    useEffect(() => {
        buscarTarefas();
        if (editando) {
            buscarTarefas();
            consultarProjetoPorId();  // Carrega os dados do projeto quando entrar em modo de edição
        }
    }, [editando]);  // Essa dependência garante que as alterações do estado 'editando' disparem a função

    // Fecha os detalhes sempre que o refreshToggle mudar
    useEffect(() => {
        buscarTarefas();
        setIsOpen(false);
    }, [refreshToggle]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.titleBox} onPress={toggleAccordion}>
                <Text style={styles.title}>{nome}</Text>
                <Feather
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#fff"
                />
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.contentBox}>
                    <View style={styles.subTitleBox}>
                        <Text style={{
                            fontSize: 18,
                            backgroundColor: '#947759',
                            padding: 10,
                            width: '30%',
                            textAlign: 'center',
                            borderRadius: 50,
                            color: '#FFF',
                            fontWeight: '700'
                        }}>Id: {id}</Text>
                        <Text style={{
                            fontSize: 22,
                            color: '#FFF',
                            fontWeight: '700',
                            textAlign: 'center',

                        }}>{tipo} - {cliente}</Text>
                        <View style={{
                            borderWidth: 1,
                            marginVertical: 10,
                            alignSelf: 'center',
                            width: 200,
                        }} />
                        <Text style={styles.subSubTitle}>Contato: {contato}</Text>
                        <Text style={styles.subSubTitle}>Iniciado em {formatData(data || '')}</Text>
                    </View>

                    <View style={styles.descriptionBox}>
                        <Text style={styles.descriptionTitle}>Sobre o Projeto:</Text>
                        <Text style={styles.description}>{descricao}</Text>
                    </View>

                    {tarefas.length > 0 && (
                        <>
                            <Text style={styles.subTitle}>Tarefas</Text>
                            <View style={{
                                borderWidth: 1.5,
                                marginVertical: 10,
                                alignSelf: 'center',
                                width: 230,
                            }} />
                            {tarefas.map((item) => (
                                <View style={styles.taskContainer} key={item.id}>
                                    <Entypo name="dot-single" size={24} color="black" />
                                    <Text style={styles.taskText}>{item.descricao}</Text>
                                </View>
                            ))}
                        </>
                    )}

                    <View>
                        <Text style={styles.subTitle}>Valores</Text>
                        <View style={styles.divider} />
                        <View style={styles.ValuesBox}>
                            <Text style={styles.ValueLabel}>Valor Estimado:</Text>
                            <Text style={styles.Value}>R$ {valor}</Text>
                        </View>
                        <View style={styles.ValuesBox}>
                            <Text style={styles.ValueLabel}>Quanto foi Pago:</Text>
                            <Text style={styles.Value}>R$ {pago}</Text>
                        </View>
                    </View>


                    {editando == false ?
                        (<>
                            <Pressable style={styles.previewIcons}>
                                <FontAwesome name="trash" size={54} color="black" onPress={Deletar} />
                                <Feather name="edit" size={50} color="black" onPress={() => {
                                    setEditando(true)
                                    consultarProjetoPorId()
                                    buscarTarefas()

                                }} />
                            </Pressable>
                        </>
                        )
                        :
                        <>
                            <View style={styles.subTitleBox}>
                                <Text style={styles.subTitle}>Edições</Text>
                                <View style={styles.divider} />
                            </View>
                        </>
                    }
                    {editando &&
                        <>
                            <View>
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
                                            display='inline'
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

                                <View style={styles.descriptionBox}>
                                    <Text style={styles.descriptionTitle}>Sobre o Projeto:</Text>
                                    <Text style={{
                                        borderRadius: 10,
                                        borderColor: '#665441',
                                        borderWidth: 2,
                                        color: '#333',
                                        fontSize: 16,
                                        backgroundColor: '#FFF',
                                        padding: 10,
                                        marginTop: 5,
                                        textAlign: 'center',
                                    }}>{descricaoProjeto}</Text>
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

                                <Pressable onPress={alterarProjeto}>
                                    <Text style={styles.button}>ALTERAR</Text>
                                </Pressable>

                                <Pressable onPress={() => setEditando(false)}>
                                    <MaterialIcons name="edit-off" size={54} color="black" style={{
                                        textAlign: 'right',
                                        paddingRight: 10,
                                    }}/>
                                </Pressable>
                            </View>
                        </>
                    }
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
    },
    titleBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#665441',
        padding: 15,
        marginTop: 20,
        width: '80%',
        borderRadius: 10,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
    },
    input: {
        width: 200,
        borderColor: '#665441',
        borderWidth: 2,
        borderRadius: 5,

        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        alignSelf: 'center',
        padding: 12,
        height: 50,
    },
    inputs: {
        marginTop: 20,
        justifyContent: 'center',
    },
    dataInputBox: {
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 20,
        // borderWidth: 1,
        width: '100%',

    },
    dataInput: {
        alignSelf: 'center',
        width: 160,
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
        alignSelf: 'center',
        backgroundColor: '#A6896B',
        textAlign: 'center',
        width: '65%',
        paddingHorizontal: 50,
        paddingVertical: 8,
        marginTop: 40,
        marginBottom: 50,
        fontSize: 18,
        color: '#FFF',
        borderRadius: 100,
    },
    contentBox: {
        width: '80%',
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        paddingBottom: 20,
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 23,
        marginTop: 10,
        fontWeight: '700',
    },
    subTitleBox: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
        backgroundColor: '#B3B3B3',
    },
    subSubTitle: {
        fontSize: 18,
        textAlign: 'center',
    },
    divider: {
        borderWidth: 1.5,
        marginVertical: 10,
        alignSelf: 'center',
        width: '80%',
    },
    descriptionBox: {
        padding: 15,
    },
    descriptionTitle: {
        alignSelf: 'center',
        paddingLeft: 10,
        marginBottom: 5,
        fontSize: 18,
        borderColor: '#665441',
        borderWidth: 0.1,
    },
    description: {
        borderRadius: 10,
        color: '#333',
        fontSize: 16,
        backgroundColor: '#FFF',
        padding: 10,
        marginTop: 5,
        textAlign: 'center',
    },
    taskContainer: {
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    taskText: {
        fontSize: 17,
        marginLeft: 10,
    },
    ValuesBox: {
        padding: 10,
    },
    ValueLabel: {
        fontSize: 20,
        fontWeight: '500',
        paddingLeft: 15,
    },
    Value: {
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: '#FFF',
        paddingVertical: 10,
        fontSize: 17,
        marginTop: 10,
        width: '50%',
        fontWeight: '500',
        textAlign: 'center',
    },
    previewIcons: {
        paddingRight: 10,
        marginTop: 10,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        gap: 10
    },
});

export default Projeto;
