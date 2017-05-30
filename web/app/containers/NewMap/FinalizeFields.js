import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Polygon } from 'react-leaflet';
import { Line } from 'rc-progress';

export default class FinalizeFields extends React.Component {
    constructor(props) {
        super(props);

        this.validate = this.validate.bind(this);
        this.validateAndSubmit = this.validateAndSubmit.bind(this);
        this.validateAndPrevious = this.validateAndPrevious.bind(this);
        this.renderPolygons = this.renderPolygons.bind(this);
    }

    validate() {
        return true;
    }

    validateAndSubmit() {
        if (this.validate()) this.props.handleSubmit();
    }

    validateAndPrevious() {
        this.props.prevStep();
    }

    renderPolygons() {
        return (this.props.pointsOfInterest) ? this.props.pointsOfInterest.map((point) => {
            const position = point.boundary.points;
            return (
                <Polygon
                    positions={position}
                    color={point.color}
                    fillColor={point.color}
                />
            );
        }) : null;
    }

    render() {
        const { position, step } = this.props;
        const percent = (step / 4) * 100;

        const pointsOfInterest = this.renderPolygons();

        return (
            <div className="gr-wrapper gr-newmap--wrapper">
                <div className="gr-sidebar--wrapper">
                    <div className="gr-sidebar">
                        <div className="gr-sidebar--top">
                            <h1>Guorient</h1>
                            <div className="gr-progress">
                                Step {step + 1} of 5
                                <Line
                                    style={{
                                        height: '12px',
                                        width: '100%',
                                        borderRadius: '6px',
                                    }}
                                    percent={percent}
                                    strokeColor="#EB3986"
                                />
                            </div>
                        </div>
                        <div className="vcenter form-group">
                            <h4 className="gr-sidebar--instruction">
                                Finalize
                            </h4>
                        </div>
                        <div className="gr-step--selector gr-sidebar--bottom">
                            <button
                                className="btn btn-default gr-btn--left gr-btn"
                                onClick={this.validateAndPrevious}
                            >
                                Needs fixing!
                            </button>
                            <button
                                className="btn btn-default gr-btn--right gr-btn gr-btn--success"
                                onClick={this.validateAndSubmit}
                            >
                                Looks good!
                            </button>
                        </div>
                    </div>
                </div>
                <div className="gr-map--wrapper">
                    <Map
                        center={position}
                        zoom={18}
                        scrollWheelZoom={false}
                        style={{
                            height: '100vh',
                        }}
                    >
                        <TileLayer
                            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        <Polygon
                            positions={this.props.polyCoords}
                        />
                        {pointsOfInterest}
                    </Map>
                </div>
            </div>
        );
    }
}

FinalizeFields.propTypes = {
    step: PropTypes.number,
    nextStep: PropTypes.func,
    prevStep: PropTypes.func,
    handleSubmit: PropTypes.func,
    polyCoords: PropTypes.array,
    pointsOfInterest: PropTypes.array,
    position: PropTypes.object,
};
