import React, { forwardRef } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { env } from '../src/config/env';

const useGoogleMaps = Boolean(env.googleMapsApiKey);

const NativeMapView = forwardRef<MapView, React.ComponentProps<typeof MapView>>(
  function NativeMapView(props, ref) {
    return (
      <MapView
        ref={ref}
        provider={useGoogleMaps ? PROVIDER_GOOGLE : undefined}
        {...props}
      />
    );
  }
);

export { NativeMapView as MapView, Marker, Polyline, PROVIDER_GOOGLE };
export default NativeMapView;
