import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import { crudCreate as crudCreateAction } from '../../actions/dataActions';
import translate from '../../i18n/translate';

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
    };
}

const enhance = compose(
    connect(
        mapStateToProps,
        { crudCreate: crudCreateAction },
    ),
    translate,
);

export const enhanceCreate = (Com) => {
    class Create extends Component {
        getBasePath() {
            const { location } = this.props;
            return location.pathname.split('/').slice(0, -1).join('/');
        }

        handleSubmit = record => this.props.crudCreate(this.props.resource, record, this.getBasePath());

        render() {
            const { actions, children, isLoading, resource, title, translate } = this.props;
            const basePath = this.getBasePath();

            const resourceName = translate(`resources.${resource}.name`, {
                smart_count: 1,
                _: inflection.humanize(inflection.singularize(resource)),
            });
            const defaultTitle = translate('aor.page.create', {
                name: `${resourceName}`,
            });

            return (React.createElement(Com, {
                isLoading,
                basePath,
                resource,
                title,
                defaultTitle,
                actions: actions && React.cloneElement(actions, {
                    basePath,
                    resource,
                }),
                content: children && React.cloneElement(children, {
                    onSubmit: this.handleSubmit,
                    resource,
                    basePath,
                    record: {},
                }),
            })
            );
        }
    }
    Create.propTypes = {
        actions: PropTypes.element,
        children: PropTypes.element,
        crudCreate: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
        title: PropTypes.any,
        translate: PropTypes.func.isRequired,
    };

    Create.defaultProps = {
        data: {},
    };
    return Create;
};

export default Com => enhance(enhanceCreate(Com));
