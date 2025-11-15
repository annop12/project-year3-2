import { View as RNView, ViewProps } from 'react-native';
import React from 'react';

interface StyledViewProps extends ViewProps {
  className?: string;
}

export function StyledView({ className, style, ...props }: StyledViewProps) {
  // For now, ignore className and just use regular View
  // This is a temporary workaround for NativeWind v4 issues
  return <RNView style={style} {...props} />;
}
