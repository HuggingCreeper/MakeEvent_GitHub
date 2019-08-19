import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";

import Dashboard from "../imports/ui/Dashboard";
import App from "../imports/ui/App";
import "../imports/startup/account-config";

Meteor.startup(() => {
  render(<App />, document.getElementById("render-target"));
});
