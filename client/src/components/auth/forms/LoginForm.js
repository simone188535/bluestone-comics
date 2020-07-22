import React from 'react';

let LoginForm = (props) => {
    // const dispatch = useDispatch();
    return(
        <div>
            <form onSubmit={props.handleSubmit(values => console.log(values))}>
            <button type="submit">Submit</button>
            </form>
        </div>
    );
}
export default LoginForm;