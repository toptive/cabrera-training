
function FormAddBalance(props) {
    const {
        onSubmitHandler,
        onChange,
        loading,
        stateFormData,
        stateFormError,
        stateFormValid,
        stateFormMessage,
    } = props;

    return (
        <form className="form-login card" method="POST" onSubmit={onSubmitHandler}>
            <div className="form-group">
                <h2>Add balance</h2>
                <hr />
                {stateFormMessage.status === 'error' && (
                    <h4 className="warning text-center">{stateFormMessage.error}</h4>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="balance">Title</label>
                <input
                    className="form-control"
                    type="text"
                    id="balance"
                    name="balance"
                    placeholder="Please type the balance can be 50 100 500"
                    onChange={onChange}
                    value={stateFormData.balance.value}
                />
                {stateFormError.balance && (
                    <span className="warning">{stateFormError.balance.hint}</span>
                )}
            </div>
            <div>
                <button
                    type="submit"
                    className="btn btn-block btn-warning"
                    disabled={loading}
                >
                    {!loading ? 'Login' : 'Loading...'}
                </button>
            </div>
        </form>
    );
}
export default FormAddBalance;
