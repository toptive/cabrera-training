function FormEvent(props) {
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
      <form onSubmit={onSubmit} className="form-post card" method="POST">
        <div className="form-group">
          <h2>Form Event</h2>
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
            id="text"
            name="title"
            placeholder="Event Title"
            onChange={onChange}
            readOnly={loading && false}
            value={stateFormData.title.value}
          />
          {stateFormError.title && (
            <span className="warning">{stateFormError.title.hint}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="text">Description</label>
          <textarea
            className="form-control"
            type="text"
            id="text"
            name="description"
            placeholder="Event Description"
            onChange={onChange}
            readOnly={loading && false}
            value={stateFormData.description.value}
          />
          {stateFormError.description && (
            <span className="warning">{stateFormError.description.hint}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="date">Date Init</label>
          <input
            className="form-control"
            type="date"
            id="dateInit"
            name="dateInit"
            placeholder="Date Init"
            onChange={onChange}
            readOnly={loading && false}
            value={stateFormData.dateInit.value}
          />
          {stateFormError.dateInit && (
            <span className="warning">{stateFormError.dateInit.hint}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="date">Date End</label>
          <input
            className="form-control"
            type="date"
            id="dateEnd"
            name="dateEnd"
            placeholder="Date End"
            onChange={onChange}
            readOnly={loading && false}
            value={stateFormData.dateEnd.value}
          />
          {stateFormError.dateEnd && (
            <span className="warning">{stateFormError.dateEnd.hint}</span>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-block btn-warning"
            disabled={loading}
          >
            {!loading ? 'Submit' : 'Submitting...'}
          </button>
        </div>
      </form>
    );
  }
  export default FormEvent;