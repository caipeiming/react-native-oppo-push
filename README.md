
# react-native-oppo-push

## Getting started

`$ npm install react-native-oppo-push --save`

### Mostly automatic installation

`$ react-native link react-native-oppo-push`

### Manual installation


#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import top.cpming.rn.push.oppo.RNOppoPushPackage;` to the imports at the top of the file
  - Add `new RNOppoPushPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-oppo-push'
  	project(':react-native-oppo-push').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-oppo-push/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-oppo-push')
  	```


## Usage
```javascript
import RNOppoPush from 'react-native-oppo-push';

// TODO: What to do with the module?
RNOppoPush;
```
  