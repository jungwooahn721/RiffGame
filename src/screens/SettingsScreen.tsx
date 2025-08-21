import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handleInviteFriend = () => {
    Alert.alert(
      'Invite Friends',
      'Share RiffGame with your friends!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Share functionality') },
      ]
    );
  };

  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => console.log('Log out') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete account') },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy will be displayed here.');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of service will be displayed here.');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support at support@riffgame.com');
  };

  const renderSettingItem = (
    iconName: string,
    title: string,
    onPress: () => void,
    isDestructive = false
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, isDestructive && styles.destructiveItem]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <Icon 
          name={iconName} 
          size={24} 
          color={isDestructive ? '#ff4757' : '#9d4edd'} 
        />
        <Text style={[styles.settingText, isDestructive && styles.destructiveText]}>
          {title}
        </Text>
      </View>
      <Icon 
        name="chevron-forward" 
        size={20} 
        color={isDestructive ? '#ff4757' : '#8e8e93'} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 50 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderSettingItem('person-add-outline', 'Invite Friends', handleInviteFriend)}
          {renderSettingItem('notifications-outline', 'Notifications', () => Alert.alert('Notifications', 'Notification settings coming soon!'))}
          {renderSettingItem('shield-checkmark-outline', 'Privacy', handlePrivacyPolicy)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderSettingItem('help-circle-outline', 'Help & Support', handleSupport)}
          {renderSettingItem('document-text-outline', 'Terms of Service', handleTermsOfService)}
          {renderSettingItem('information-circle-outline', 'About', () => Alert.alert('About', 'RiffGame v1.0.0'))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          {renderSettingItem('log-out-outline', 'Log Out', handleLogOut, true)}
          {renderSettingItem('trash-outline', 'Delete Account', handleDeleteAccount, true)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginRight: 32, // Compensate for back button
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 12,
  },
  destructiveItem: {
    backgroundColor: '#2a1a1a',
  },
  destructiveText: {
    color: '#ff4757',
  },
});

export default SettingsScreen;
