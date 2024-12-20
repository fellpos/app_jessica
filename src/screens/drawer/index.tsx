import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import Projetos from '../tabs';
import Forms from './formularios';

export default function App() {
  const Drawer = createDrawerNavigator();

  function tela(props: { nome: string; icone: string; titulo: string; componente: any }) {
    return (
      <Drawer.Screen
        name={props.nome}
        component={props.componente}
        options={({ navigation }) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={55}
              color="#fff"
              style={{ marginLeft: 10 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
          drawerIcon: ({ focused }: any) => (
            <MaterialCommunityIcons
              name={props.icone as any}
              size={24}
              color={focused ? '#FFFFFF' : '#665441'}
            />
          ),
          drawerLabel: props.titulo,
          title: props.titulo,
          drawerActiveTintColor: '#FFFFFF',
          drawerInactiveTintColor: '#665441',
          drawerActiveBackgroundColor: '#665441',
          drawerStyle: styles.drawer,
          drawerItemStyle: styles.drawerItem,
        })}
        
      />
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        {tela({
          nome: 'Projetos',
          icone: 'pencil-ruler',
          titulo: 'Projetos',
          componente: Projetos,
        })}

        {tela({
          nome: 'Formulários',
          icone: 'email',
          titulo: 'Formulários',
          componente: Forms,
        })}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#947759',
    elevation: 0, // Remove sombra no Android
    shadowOpacity: 0, // Remove sombra no iOS
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: '#ffff',
  },
  drawer: {
    backgroundColor: 'rgba(166, 137, 107, 0.83)',
  },
  drawerItem: {
    borderRadius: 30,
  },
});
