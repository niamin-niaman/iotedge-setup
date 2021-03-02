'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;

Client.fromEnvironment(Transport, function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', function (err) {
      throw err;
    });

    // get desired twin
    client.getTwin(function (err, twin) {
      if (err) {
        console.error('Could not get device twin');
      } else {
        console.log('Device twin created');

        // Handle all desired property updates
        twin.on('properties.desired', function (desired) {
          console.log('\nNew desired properties received:');

          console.log("------- DESIRED PROPERTIES ----------");
          console.log(desired);
          console.log("-------------------------------------");

          if (desired) {

            if (desired.timeout) {
              timeout = desired.timeout
              console.log('timeoute has set : ', timeout);
            }
            if (desired.pullingInterval) {
              pullingInterval = desired.pullingInterval
              console.log("pullingInterval has set : ", pullingInterval);
            }
            // add desired.pullingInterval

            console.log('desired has set');

            // set pulishtime and call CheckPAsStatuss function
            try {

              // exact data from desired and report properties
              let path = (({ timeout, pullingInterval }) => ({ timeout, pullingInterval }))(desired)
              console.log("------- REPORT PROPERTIES ----------");
              console.log(path);
              console.log("-------------------------------------");
              // set report properties
              twin.properties.reported.update(path, function (err) {
                if (err) throw err;
                console.log('twin state reported');
              });

              // CODE HERE AFTER GET DEVICE TWIN

            } catch (error) {
              
              console.log('Error: ',error.message);

            }

          }
          // else desired not set or has no desired
          else {

            console.log('no desired value');
            if (!desired.hasOwnProperty('timeout'))
              console.log('desire property : timout not fond');
            if (!desired.hasOwnProperty('pullingInterval'))
              console.log('desire property : pullingInterval not fond');
          }

        });

      }
    });

    // connect to the Edge instance
    client.open(function (err) {
      if (err) {
        throw err;
      } else {
        console.log('IoT Hub module client initialized');

        // CODE HERE

      }
    });


  }
});

