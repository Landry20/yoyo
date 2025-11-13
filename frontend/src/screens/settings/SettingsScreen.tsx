import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/apiService';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Settings {
  blocage_capture: boolean;
  auto_destruction: boolean;
  duree_auto_destruction?: number;
  visibilite: 'public' | 'abonnes' | 'personnalise';
  notifications_push: boolean;
  notifications_message: boolean;
  notifications_commentaire: boolean;
  notifications_abonnement: boolean;
}

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiService.get('/settings');
      setSettings(response.data.data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof Settings, value: any) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);

    setSaving(true);
    try {
      await apiService.put('/settings', updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      // Restaurer l'ancienne valeur en cas d'erreur
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!settings) {
    return (
      <View style={styles.center}>
        <Text>Erreur de chargement</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidentialité</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Blocage des captures d'écran</Text>
              <Text style={styles.settingDescription}>
                Empêche la capture d'écran dans l'application
              </Text>
            </View>
            <Switch
              value={settings.blocage_capture}
              onValueChange={(value) => updateSetting('blocage_capture', value)}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Messages auto-destructeurs</Text>
              <Text style={styles.settingDescription}>
                Les messages disparaissent après un certain temps
              </Text>
            </View>
            <Switch
              value={settings.auto_destruction}
              onValueChange={(value) => updateSetting('auto_destruction', value)}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Visibilité du profil</Text>
              <Text style={styles.settingDescription}>
                Qui peut voir votre profil
              </Text>
            </View>
            <View style={styles.visibilityButtons}>
              {(['public', 'abonnes', 'personnalise'] as const).map((vis) => (
                <TouchableOpacity
                  key={vis}
                  style={[
                    styles.visibilityButton,
                    settings.visibilite === vis && styles.visibilityButtonActive,
                  ]}
                  onPress={() => updateSetting('visibilite', vis)}
                >
                  <Text
                    style={[
                      styles.visibilityButtonText,
                      settings.visibilite === vis && styles.visibilityButtonTextActive,
                    ]}
                  >
                    {vis === 'public' ? 'Public' : vis === 'abonnes' ? 'Abonnés' : 'Personnalisé'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications push</Text>
            </View>
            <Switch
              value={settings.notifications_push}
              onValueChange={(value) => updateSetting('notifications_push', value)}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications de messages</Text>
            </View>
            <Switch
              value={settings.notifications_message}
              onValueChange={(value) => updateSetting('notifications_message', value)}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications de commentaires</Text>
            </View>
            <Switch
              value={settings.notifications_commentaire}
              onValueChange={(value) => updateSetting('notifications_commentaire', value)}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications d'abonnements</Text>
            </View>
            <Switch
              value={settings.notifications_abonnement}
              onValueChange={(value) => updateSetting('notifications_abonnement', value)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
  },
  visibilityButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  visibilityButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  visibilityButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  visibilityButtonText: {
    fontSize: 12,
    color: '#666',
  },
  visibilityButtonTextActive: {
    color: '#FFF',
  },
});

export default SettingsScreen;

