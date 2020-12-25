# API

- The `setDebugMode` method allows you to set the debug mode
  - Parameter:
    - `use`: A boolean indicating that the debug should be enable or not. Default to `false`
  - Example:

    ```js
    cerm.setDebugMode(true); // to enable it
    ```

- The `listAll` method allows you to get the entire list of listeners that you suscribed
  - Example:

    ```js
    cerm.listAll();
    ```

- The `getListenerDetailsByType` method allows you to get the details of all event listeners for a specific type
  - Parameter:
    - `type`: A case-sensitive string representing the event type to use for getting the details
  - Example:

    ```js
    // get all suscribed event listeners for the "click" type
    cerm.getListenerDetailsByType("click");
    ```

- The `getListenerDetailsById` method allows you to get the details of an event listener by his internal id _(note: each saved event has an uniq id)_

  - Parameter:

    - `id`: A case-sensitive string or a number indicating that used for getting the details

  - Example:

    ```js
    // get the saved event with the id 0
    cerm.getListenerDetailsById(0);
    ```

- The `addEventListener` method allows you to add an event listener for a specific target and preserves it in internal history

  - Parameters:

    - `target`: An element to attach the listener
    - `type`: A case-sensitive string representing the event type to listen for
    - `listener`: An event listener callback
    - `options`: An options object specifies characteristics about the event listener
    - `customId`: A custom id used to set the \_id of the event

  - Example:

    ```js
    // show "Hello World!" in the web console when key pressed
    cerm.addEventListener(
      document.body,
      "keypress",
      function (event) {
        console.debug("Hello World!");
      },
      undefined,
      "testId"
    );
    ```

- The `removeEventListenersByType` method allows you to remove all the event listeners attached to a specific type

  - Parameters:

    - `type`: A case-sensitive string representing the event type to use for remove the associated listeners
    - `basicCheckProcess`: A boolean that determines if we need to execute the basic check up process. Default to `true`.

  - Example:

    ```js
    // Remove all keypress event listeners on any target
    cerm.removeEventListenersByType("keypress");
    ```

- The `removeEventListenersByTypes` method allows you to remove all the event listeners attached for each specific type provided in args

  - Parameters:

    - `types`: An array of case-sensitive strings representing the event type to use for remove the associated listeners

  - Example:

    ```js
    cerm.removeEventListenersByTypes(["keypress", "click", "customEvent1"]);
    ```

- The `removeEventListenersByTarget` method allows you to remove all the event listeners attached to a specific target

  - Parameters:

    - `target`: A reference to the target to which the event listeners will be removed
    - `basicCheckProcess`: A boolean that determines if we need to execute the basic check up process. Default to `true`.

  - Example:

    ```js
    // Remove all event listeners for a target
    cerm.removeEventListenersByTarget(document.body);
    ```

- The `removeEventListenersByTargets` method allows you to remove all the event listeners attached for each target provided in args

  - Parameters:

    - `targets`: An array of references to the targets to which the event listeners will be removed

  - Example:

    ```js
    cerm.removeEventListenersByTargets(["keypress", "click", "customEvent1"]);
    ```

- The `removeEventListenerById` method allows you to remove all the event listeners attached by a his id

  - Parameters:

    - `id`: A related id used that identify the event listener to remove
    - `basicCheckProcess`: A boolean that determines if we need to execute the basic check up process. Default to `true`

  - Example:

    ```js
    // Remove the event listener with specific id
    cerm.removeEventListenerById(1);
    ```

- The `removeEventListenerByIds` method allows you to remove all the event listeners attached for each id provided in args
  - Parameters:

    - `ids`: An array of related id used that identify the different event listeners to remove

  - Example:

    ```js
    cerm.removeEventListenerByIds([1, "customId1", 0]);
    ```

## Example

```js
cerm.addEventListener(window, "waitingSomething", function (event) { // addEventListener
  console.debug("Do something");
});
/...
cerm.removeEventListenersByType("waitingSomething"); // removeEventListener
```
