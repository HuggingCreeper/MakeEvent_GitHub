import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";

import Dashboard from "../imports/ui/Dashboard";
import "../imports/startup/account-config";

Meteor.startup(() => {
  render(<Dashboard />, document.getElementById("render-target"));
});
