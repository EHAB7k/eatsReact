import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Keyboard,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import {DrawerActions} from 'react-navigation-drawer';
import {Header} from '../../components/Header';
import {getConfiguration} from '../../utils/configuration';
import strings from '../../constants/lang';
import Activity from '../../components/ActivityIndicator';
import {get} from '../../utils/api';
import {errorAlert} from '../../utils/genricUtils';

export default class Support extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ticketList: [],
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    const {params} = payload.action;
    this.handleTicketsApi();
  };

  // ********* Handle Main Functions ********** //

  handleTicketsApi = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      const data = {};
      const res = await get('/api/v1/user/getSupportData');
      if (res?.status === 'success') {
        this.setState({
          ticketList: res?.data,
        });
      } else {
        errorAlert(res?.message);
      }
      this.setState({
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  sendMessage() {
    this.props.navigation.navigate('SupportMessage');
  }

  render() {
    const {navigation} = this.props;
    const {isLoading, ticketList} = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView
          style={{
            backgroundColor: Colors.secondary,
          }}
        />
        <Header
          title={strings.HELP_N_SUPPORT}
          navigation={navigation}
          screen="HelpAndSupport"
        />

        <View style={styles.contentContainer}>
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={ticketList}
            keyExtractor={(item, index) => `${index}_supportList`}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Dispute', {item})}
                style={[
                  styles.itemWrapper,
                  {
                    borderBottomWidth: dummyData.length === index + 1 ? 0.8 : 0,
                  },
                ]}>
                <Text style={styles.reasonText}>{item.msg}</Text>
                <Text style={styles.idtext}>
                  {strings.TICKET_ID}
                  {item.ticketId}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => this.sendMessage()}
            style={styles.floatingButton}>
            <Image style={styles.floatingIcon} source={Images.plusIcon} />
          </TouchableOpacity>
        </View>

        {isLoading ? <Activity /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: '5%',
  },
  itemWrapper: {
    paddingHorizontal: '5%',
    paddingVertical: '5%',
    borderColor: Colors.borderGray,
    borderTopWidth: 0.8,
  },
  reasonText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 18,
    color: Colors.textBlack,
    marginBottom: '1%',
    textAlign: 'left',
  },
  idtext: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 18,
    color: Colors.textBlack,
    textAlign: 'left',
  },
  floatingButton: {
    position: 'absolute',
    zIndex: 2,
    bottom: '5%',
    right: '5%',
  },
  floatingIcon: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
});

const dummyData = [
  {
    name: 'Service was not Good',
    orderId: '#1234567',
  },
  {
    name: 'Wrong order delivered',
    orderId: '#1234567',
  },
];
