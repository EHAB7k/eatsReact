const Config = {
     //NAVIGATION
     Login: 'Login',
     Register: 'Register',
     Password: 'Password',
     Dashboard: 'Dashboard',
     DrawerStack: 'DrawerStack',
     DriverDetails: 'DriverDetails',
     PanicScreen: 'PanicScreen',
     VerifyOTP: 'VerifyOTP',
     ChangePassword: 'ChangePassword',
     SideMenu: 'SideMenu',
     HelpSupport: 'HelpSupport',
     Profile: 'Profile',
     EditProfile: 'EditProfile',
     NeedHelp: 'NeedHelp',
     AddCard: 'AddCard',
     CarSchedule: 'CarSchedule',
     MyTrips: 'MyTrips',
     PaymentMethod: 'PaymentMethod',
     Payments: 'Payments',
     BookingDetails: 'BookingDetails',
     AboutUs: 'AboutUs',

     //................................................

     // API CONFIG
     // URL: 'http://18.220.183.250:5004/',
     URL: 'https://eats-api.ondemandcreations.com/',
     register: 'api/v1/user/register',
     login: 'api/v1/user/login',
     password: 'api/v1/user/password',
     forgotpassword: 'api/v1/user/forgotpassword',
     resetpassword: 'api/v1/user/resetpassword',
     changepassword: 'api/v1/user/changepassword',
     resendotp: 'api/v1/user/resendotp',
     profile: 'api/v1/user/profile',
     updateprofile: 'api/v1/user/updateprofile',
     logout: 'api/v1/user/logout',
     everything: 'api/v1/user/everything',
     upload: 'api/v1/user/upload',
     getuser: 'api/v1/user',
     getRegionList: 'api/v1/tawseel/getRegionList',
     getCitieList: 'api/v1/tawseel/getCitieList',

     kHeaderValues: {
          'Content-Type': 'application/json',
     },
     kMethodPostKey: 'post',
     kMethodGetKey: 'get',
};
//COMMON STATUS
export const SUCCESS = 'success';
export const FAILURE = 'failure';
export const ERROR = 'Something went wrong!!';

//EVENT STATUS
export const PENDING = 'pending';
export const COMPLETED = 'completed';
export const CONFIRMED = 'confirmed';
export const INROUTE = 'inroute';
export const INPROCESS = 'inprocess';
export const INTERESTED = 'interested';
export const STARTED = 'started';
export const FINISH = 'finish';
export const CANCEL = 'cancel';

export const data = [
     {
          _id: '5d64c0e254548f7aade622c1',
          modelId: '5d5155c9582af4648aa8fce3',
          eventId: {
               eventLocation: {
                    type: 'Point',
                    coordinates: [18.34567, 12.34567],
               },
               eventDetailDoc:
                    'https://otomatic.s3.us-east-2.amazonaws.com/1566879332625female.png',
               eventCoverImage:
                    'https://otomatic.s3.us-east-2.amazonaws.com/15668793329961562562579139log.png',
               _id: '5d64ae655c63df67eedcc4dc',
               userID: '123232434567',
               eventName: 'jklfsdg',
               eventDate: '2020-01-02T00:00:00.000Z',
               eventStartTime: '12.50',
               eventEndTime: '4.30',
               eventAddress: 'mohali 4 phase',
               eventProducts: 'fdsafdf',
               eventDistributor: 'adsf',
               eventDress: 'faf',
               eventModel: 'fasdftu',
               eventPos: 'dfghfgh',
               eventAbout: 'this is about',
               eventStatus: 'on',
               createdAt: '2019-08-27T04:15:33.088Z',
          },
          status: 'pending',
          createdAt: '2019-08-27T05:34:26.862Z',
     },
];

export default Config;
