import React from 'react';
import { Field, reduxForm } from 'redux-form';
import AuthField from './AuthField';

const renderFields = () => {
    return (
        <Field type="text" name="email" component={AuthField} />
    );
}
let LoginForm = (props) => {
    // const dispatch = useDispatch();
    return(
        <div>
            <form onSubmit={props.handleSubmit(values => console.log(values))}>
                {renderFields()}
            {/* <Field type="text" name="email" component="input"/>
            <Field type="text" name="password" component="input"/> */}
            <button type="submit">Submit</button>
            </form>
        </div>
    );
}
LoginForm = reduxForm({
    // a unique name for the form
    form: 'LoginForm'
  })(LoginForm)
export default LoginForm;