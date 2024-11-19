import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Tela1 from './tela1'
import Tela2 from './tela2'
import Tela3 from './tela3'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'

export default function Projetos() {
    const Tabs = createBottomTabNavigator()
    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="Tela1"
                component={Tela1}
                options={{
                    title: 'Consulta',
                    tabBarActiveTintColor: '#FFF',
                    tabBarInactiveTintColor: '#665441',

                    tabBarStyle: styles.tabs,
                    tabBarLabelStyle: styles.title,

                    tabBarActiveBackgroundColor: '#A6896B',
                    tabBarInactiveBackgroundColor: '#A6896B',
                    tabBarIcon: ({ focused }: any) => (
                        <Ionicons
                            name={focused ? 'caret-up' : 'caret-down'}
                            size={20}
                            color={focused ? '#FFF' : '#665441'}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Tela2"
                component={Tela2}
                options={{
                    title: 'Novo',
                    tabBarActiveTintColor: '#FFF',
                    tabBarInactiveTintColor: '#665441',

                    tabBarStyle: styles.tabs,
                    tabBarLabelStyle: styles.title,

                    tabBarActiveBackgroundColor: '#A6896B',
                    tabBarInactiveBackgroundColor: '#A6896B',
                    tabBarIcon: ({ focused }: any) => (
                        <Ionicons
                            name={focused ? 'caret-up' : 'caret-down'}
                            size={20}
                            color={focused ? '#FFF' : '#665441'}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Tela3"
                component={Tela3}
                options={{
                    title: 'Andamento',
                    tabBarActiveTintColor: '#FFF',
                    tabBarInactiveTintColor: '#665441',

                    tabBarStyle: styles.tabs,
                    tabBarLabelStyle: styles.title,

                    tabBarActiveBackgroundColor: '#A6896B',
                    tabBarInactiveBackgroundColor: '#A6896B',
                    tabBarIcon: ({ focused }: any) => (
                        <Ionicons
                            name={focused ? 'caret-up' : 'caret-down'}
                            size={20}
                            color={focused ? '#FFF' : '#665441'}
                        />
                    ),
                }}
            />
        </Tabs.Navigator>
    )
}

const styles = StyleSheet.create({
    tabs: {
        backgroundColor: '#A6896B',
        height: 70,
    },
    title: {
        fontSize: 14,
    }
})