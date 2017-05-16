import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

const propTypes = {
    nextStep: PropTypes.func,
    prevStep: PropTypes.func,
    handleBoundaries: PropTypes.func,
    position: PropTypes.object,
};

export default class DrawBoundaryFields extends React.Component {
    constructor(props) {
        super(props);

        // TODO: only allow one boundary to be drawn

        this.state = {
            mapName: 'New Map',
            locationName: 'San Francisco',
            // Keeps track of if the boundary of the event has been created
            boundaryCreated: false,
        };

        this.validate = this.validate.bind(this);
        this.validateAndNext = this.validateAndNext.bind(this);
        this.validateAndPrevious = this.validateAndPrevious.bind(this);
        this._onCreate = this._onCreate.bind(this);
    }

    validate() {
        return this.state.boundaryCreated;
    }

    validateAndPrevious() {
        this.props.prevStep();
    }

    validateAndNext() {
        if (this.validate()) {
            this.props.nextStep();
        } else {
            // TODO: Log an error here
            console.log('Boundary not created');
        }
    }

    /**
     * Handler to handle the creation of polygons
     */
    _onCreate(e) {
        // Prep datatype
        this.props.handleBoundaries(e.layer._latlngs[0]);
        this.setState({
            boundaryCreated: true,
        });
    }

    render() {
        const { position } = this.props;

        return (
            <div className="gr-wrapper">
                <h4>Draw the boundary of your venue</h4>
                <div className="gr-map--wrapper">
                    <Map
                        center={position}
                        zoom={18}
                        scrollWheelZoom={false}
                        style={{
                            height: '80vh',
                        }}
                    >
                        <TileLayer
                            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        <FeatureGroup>
                            <EditControl
                                position="topleft"
                                onEdited={this._onEditPath}
                                onCreated={this._onCreate}
                                onDeleted={this._onDeleted}
                                draw={{
                                    marker: false,
                                    circle: false,
                                    rectangle: false,
                                    polyline: false,
                                }}
                            />
                        </FeatureGroup>
                    </Map>
                </div>
                <div className="gr-step--selector">
                    <button
                        className="btn btn-default gr-btn--left gr-btn"
                        onClick={this.validateAndPrevious}
                    >
                        Prev
                    </button>
                    <button
                        className="btn btn-default gr-btn--right gr-btn"
                        onClick={this.validateAndNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    }
}

DrawBoundaryFields.propTypes = propTypes;
