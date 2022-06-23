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
            id="title"
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
          {stateFormError.content && (
            <span className="warning">{stateFormError.content.hint}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="date">Day</label>
          <input
            className="form-control"
            type="date"
            id="day"
            name="day"
            placeholder="Event Day"
            onChange={onChange}
            readOnly={loading && false}
            value={stateFormData.day.value}
          />
          {stateFormError.title && (
            <span className="warning">{stateFormError.title.hint}</span>
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