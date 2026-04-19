import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export default function LGPDConsent({ value, onValueChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Estou ciente e concordo com o processamento dos dados do meu pet para fins de match, conforme a LGPD.
      </Text>
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: colors.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    marginRight: 10,
  },
});