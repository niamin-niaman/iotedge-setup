'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;

let A
let B
// let NEW_DESIRED_PROP

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

            if (desired.A) {
              A = desired.A
              console.log('A has set : ', A);
            }
            if (desired.B) {
              B = desired.B
              console.log("B has set : ", B);
            }
            // if (desired.NEW_DESIRED_PROP) {
            //   NEW_DESIRED_PROP = desired.NEW_DESIRED_PROP
            //   console.log("NEW_DESIRED_PROP has set : ", NEW_DESIRED_PROP);
            // }

            console.log('desired has set');

            // set pulishtime and call CheckPAsStatuss function
            try {

              // exact data from desired and report properties
              let path = (({
                A,
                B,
                // NEW_DESIRED_PROP,
              }) => ({
                A,
                B,
                // NEW_DESIRED_PROP,
              }))(desired)
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

              console.log('Error: ', error.message);

            }

          }
          // else desired not set or has no desired
          else {

            console.log('no desired value');
            if (!desired.hasOwnProperty('A'))
              console.log('desire property : A not fond');
            if (!desired.hasOwnProperty('B'))
              console.log('desire property : B not fond');
            // if (!desired.hasOwnProperty('NEW_DESIRED_PROP'))
            // console.log('desire property : NEW_DESIRED_PROP not fond');
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

function sendMessage(client, result) {

  // Helper function to print results in the console
  function printResultFor(op) {
    return function printResult(err, res) {
      if (err) {
        console.log(op + ' error: ' + err.toString());
      }
      if (res) {
        console.log(op + ' status: ' + res.constructor.name);
      }
    };
  }


  let module_name = ''
  // DCOST default = 0
  let DCOST = 0

  // create message object that contain result ,send to iothub.
  let message = new Message(JSON.stringify(
    // result
    // reformat
    // attach DCOST to message
    { 'DCOST': DCOST, 'data': result, 'publishTimestamp': new Date() }
  ))

  message.publishTimestamp = new Date().toJSON()
  message.contentEncoding = "UTF-8";
  message.contentType = "application/json";
  message.properties.add('module', module_name)

  console.log('------ MESSAGE --------');
  console.log(message);
  // console.log(JSON.stringify(message));
  console.log('-------------- --------');

  // send to output1
  client.sendOutputEvent('output1', message, printResultFor('message sent'));


}
