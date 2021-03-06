class FollowSuggestionsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      users: [],
      activeUsers: []
    };
  }

  componentWillMount() {
    this.fetchUsers();
    this.token = PubSub.subscribe('UserFollowButton:onClick', (message, data) => {
      this.removeUser(data.followed_id)
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }

  fetchUsers() {
    $.ajax({
      url: '/api/follow_suggestions.json',
      method: 'GET', 
      dataType: 'json',
      success: (data) => {
        const newActives = data.slice(0, 3);
        this.setState({ 
          activeUsers: newActives,
          users: [ ...data.slice(3), ...newActives ]
        });
      }
    });
  }

  render () {
    return (
      <div className="follow-suggestions-container border-top">
        <div className="suggestions-header">
          <h4 className="small-heading">{I18n.t('headings.people_to_follow')}</h4>
          <a className="refresh-link pull-right" onClick={this.refreshActiveUsers.bind(this)}>{I18n.t('application.refresh')}</a>
        </div>
        <div>
          {this.renderSuggestions()}
        </div>
      </div>
    );
  }

  renderSuggestions() {
    if (this.state.users.length === 0) {
      return <h5>{I18n.t('headings.you_follow_everybody')}</h5>
    }
    return this.state.activeUsers.map(user => {
      return (
        <React.addons.CSSTransitionGroup
          key={user.id}
          transitionName="suggestion"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          <SuggestionItem key={user.id} {...user} />
        </React.addons.CSSTransitionGroup>
      )
    });
  }

  refreshActiveUsers() {
    const newActives = this.state.users.slice(0, 3);
    this.setState({
      activeUsers: newActives,
      users: [ ...this.state.users.slice(3), ...newActives ]
    });
  }

  removeUser(id) {
    const filteredUsers = this.state.users.filter(user => {
      if (user.id === id) {
        removedUser = user;
      }
      return user.id !== id;
    });

    this.setState({
      users: filteredUsers
    });
  }

}

