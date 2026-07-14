import React from 'react';
import { View, StyleSheet } from 'react-native';

// @react-native-community/datetimepicker has no web implementation.
// This renders the equivalent native HTML input so date/time fields work on web.
type Props = {
  value: Date;
  mode?: 'date' | 'datetime' | 'time';
  minimumDate?: Date;
  onChange: (event: { type: 'set' }, date?: Date) => void;
};

const pad = (n: number) => String(n).padStart(2, '0');

function toInputValue(date: Date, mode: NonNullable<Props['mode']>) {
  const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const timePart = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (mode === 'time') return timePart;
  if (mode === 'datetime') return `${datePart}T${timePart}`;
  return datePart;
}

function fromInputValue(raw: string, mode: NonNullable<Props['mode']>, previous: Date) {
  if (mode === 'time') {
    const [h, m] = raw.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return undefined;
    const next = new Date(previous);
    next.setHours(h, m, 0, 0);
    return next;
  }
  const [datePart, timePart] = raw.split('T');
  const [y, mo, d] = datePart.split('-').map(Number);
  if (!y || !mo || !d) return undefined;
  if (mode === 'datetime' && timePart) {
    const [h, mi] = timePart.split(':').map(Number);
    return new Date(y, mo - 1, d, h || 0, mi || 0);
  }
  return new Date(y, mo - 1, d);
}

export default function DateTimePicker({ value, mode = 'date', minimumDate, onChange }: Props) {
  const htmlType = mode === 'time' ? 'time' : mode === 'datetime' ? 'datetime-local' : 'date';

  return (
    <View style={styles.wrapper}>
      <input
        type={htmlType}
        value={toInputValue(value, mode)}
        min={minimumDate ? toInputValue(minimumDate, mode) : undefined}
        onChange={(e) => {
          const next = fromInputValue(e.target.value, mode, value);
          if (next) onChange({ type: 'set' }, next);
        }}
        style={webInputStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
});

const webInputStyle: React.CSSProperties = {
  width: '100%',
  fontSize: 16,
  padding: 10,
  borderRadius: 8,
  border: '1px solid #DDDDDD',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
