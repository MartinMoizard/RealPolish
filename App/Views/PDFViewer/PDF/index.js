var React = require('react-native');

var {
	requireNativeComponent
} = React;

class PDFView extends React.Component {
  render() {
    return <RPPDFView {...this.props} />;
  }
}

PDFView.propTypes = {
	file: React.PropTypes.string,
};

var PDFView = requireNativeComponent('RPPDFView', PDFView);

module.exports = PDFView;