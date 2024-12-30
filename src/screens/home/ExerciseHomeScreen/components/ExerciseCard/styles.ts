import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  selectionIndicator: {
    position: 'absolute',
    left: wp(1),
    top: 0,
    bottom: 0,
    borderRadius: wp(1),
    backgroundColor: '#E63600',
  },
  imageContainer: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    marginRight: wp(4),
    backgroundColor: '#f5f5f5',
  }
});