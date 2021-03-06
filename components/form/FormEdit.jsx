function FormEdit(props) {
    const {
      onSubmit,
      onChange,
      loading,
      stateFormData,
      stateFormError,
      stateFormValid,
      stateFormMessage,
    } = props;
    return (
      <form onSubmit={onSubmit} className="card" method="POST">
        <div className="form-group">
          <h2>Edit Post</h2>
          <hr />
          {stateFormMessage.status === 'error' && (
            <h4 className="warning text-center">{stateFormMessage.error}</h4>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            className="form-control"
            type="text"
            id="title"
            name="title"
            placeholder="Post Title"
            onChange={onChange}
            readOnly={loading && false}
            value={stateFormData.title.value}
          />
          {stateFormError.title && (
            <span className="warning">{stateFormError.title.hint}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="text">Content</label>
          <textarea
            className="form-control"
            type="text"
            id="text"
            name="content"
            placeholder="Post Content"
            onChange={onChange}
            readOnly={loading && false}
            value={stateFormData.content.value}
          />
          {stateFormError.content && (
            <span className="warning">{stateFormError.content.hint}</span>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-block btn-warning"
            disabled={loading}
          >
            {!loading ? 'Save' : 'Saving...'}
          </button>
        </div>
      </form>
    );
  }
  export default FormEdit;
  