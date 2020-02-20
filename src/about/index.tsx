import * as React from 'react';
import {Work} from './work';
import {Language} from './language';
import {Hobby} from './hobby';
import {Route, Link, BrowserRouter} from "react-router-dom";

export class About extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="about">
        <Work />
        <Language />
        <Hobby />
      </div>
    );
  }
}