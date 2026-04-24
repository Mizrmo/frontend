import React from 'react';
import { View, Text } from 'react-native';

export const MapView = (props: any) => (
  <View style={[{ backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }, props.style]}>
    <Text style={{ color: '#64748B', fontWeight: 'bold' }}>Map preview available on mobile</Text>
    {props.children}
  </View>
);

export const Marker = (props: any) => (
  <View style={props.style}>
    {props.children}
  </View>
);

export const Polyline = (props: any) => null;
