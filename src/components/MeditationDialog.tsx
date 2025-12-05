import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface MeditationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  textContent: string;
  textTitle: string;
}

export const MeditationDialog: React.FC<MeditationDialogProps> = ({
  open,
  onOpenChange,
  textContent,
  textTitle,
}) => {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Mode Méditation"
      footer={
        <View style={styles.footer}>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            Fermer
          </Button>
        </View>
      }
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { fontFamily: typography.fonts.dancingScript },
          ]}
        >
          {textTitle}
        </Text>
        <Text
          style={[
            styles.textContent,
            { fontFamily: typography.fonts.lora },
          ]}
        >
          {textContent}
        </Text>
        <View style={styles.controls}>
          <View style={styles.controlRow}>
            <Text
              style={[
                styles.controlLabel,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              Musique d'ambiance
            </Text>
            <Switch
              value={musicEnabled}
              onValueChange={setMusicEnabled}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
          {musicEnabled && (
            <Button
              onPress={() => setIsPlaying(!isPlaying)}
              variant={isPlaying ? 'destructive' : 'default'}
              style={styles.playButton}
            >
              {isPlaying ? '⏸ Pause' : '▶ Lire'}
            </Button>
          )}
        </View>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  content: {
    maxHeight: 500,
  },
  title: {
    fontSize: 20, // text-xl
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    marginBottom: 16, // mb-4
    textAlign: 'center',
    lineHeight: 30, // line-height: 1.5
  },
  textContent: {
    fontSize: 18, // text-lg
    color: colors.foreground,
    lineHeight: 27, // line-height: 1.5
    marginBottom: 24, // mb-6
    textAlign: 'center',
    fontWeight: typography.weights.normal,
  },
  controls: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 16, // text-base
    color: colors.foreground,
    lineHeight: 24,
    fontWeight: typography.weights.normal,
  },
  playButton: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

