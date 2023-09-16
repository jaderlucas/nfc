// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';


interface ContactCardProps {
  name: string;
  phoneNumber: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ name, phoneNumber }) => {
  return (
    <View>
      <Text>Name: {name}</Text>
      <Text>Phone: {phoneNumber}</Text>
    </View>
  );
};

const App: React.FC = () => {
  const contactData = {
    name: 'John Doe',
    phoneNumber: '123-456-7890',
  };

  useEffect(() => {
    // Inicializa o NfcManager
    NfcManager.start();

    // Registra um handler para lidar com a detecção NFC
    NfcManager.setEventListener(NfcTech.Ndef, (tag) => {
      if (tag.ndefMessage) {
        // Extrai os dados do cartão de contato
        const contactCardData = JSON.parse(
          String.fromCharCode.apply(null, tag.ndefMessage[0].payload)
        );

        // Compartilha os dados ou executa qualquer ação desejada aqui
        console.log('Dados do Cartão de Contato:', contactCardData);
      }

      NfcManager.setAlertMessageIOS('Cartão de Contato Detectado!');
      NfcManager.setEventListener(NfcTech.Ndef, null);
      NfcManager.stop();
    });

    return () => {
      NfcManager.setEventListener(NfcTech.Ndef, null);
      NfcManager.stop();
    };
  }, []);

  // Função para compartilhar o cartão de contato via NFC
  const shareContactViaNFC = async () => {
    try {
      // Prepara os dados do cartão de contato
      const contactCardData = JSON.stringify(contactData);
      const bytes = [...Buffer.from(contactCardData)];

      // Escreve os dados no cartão NFC
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      await NfcManager.setAlertMessageIOS('Aproxime o cartão NFC do dispositivo');
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.releaseTechnology();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ContactCard {...contactData} />
      <TouchableOpacity onPress={shareContactViaNFC}>
        <Text>Compartilhar via NFC</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;