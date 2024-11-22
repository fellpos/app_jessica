import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import axios from 'axios';
import Projeto from '@/src/components/projeto'; // Ajuste a importação conforme necessário

interface ProjetoType {
    nome: string;
    id: string;
    cliente: string;
    tipo: string;
    inicio: string;
    contato: string;
    descricao: string;
    valor: number;
    pago: number;
}

export default function Tela1() {
    const [projetos, setProjetos] = useState<ProjetoType[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshToggle, setRefreshToggle] = useState(false); // Estado para forçar o fechamento dos detalhes

    async function buscarProjeto() {
        try {
            const url = `http://192.168.0.3:5030/projeto`; // Certifique-se que a URL está correta
            const response = await axios.get(url);
            setProjetos(response.data);
        } catch (err) {
            Alert.alert('Erro', )
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        setRefreshToggle((prev) => !prev); // Alterna o valor do toggle para fechar detalhes
        buscarProjeto();
        setRefreshing(false);
    };

    useEffect(() => {
        buscarProjeto();
    }, []);

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#007AFF']}
                    tintColor="#007AFF"
                />
            }
        >
            {projetos.map((item) => (
                <Projeto
                    key={item.id}
                    id={item.id}
                    nome={item.nome}
                    cliente={item.cliente}
                    tipo={item.tipo}
                    contato={item.contato}
                    data={item.inicio}
                    descricao={item.descricao}
                    valor={item.valor}
                    pago={item.pago}
                    refreshToggle={refreshToggle} // Passa o toggle para forçar o fechamento
                />

                
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
});
