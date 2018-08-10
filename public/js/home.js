(($) => {
  // load top 100 most visited urls
  (() => {
    axios.get('/v1.0/urls?sort=-visits&skip=0&limit=100')
      .then(function (response) {
        response.data._embeded.urls.forEach((url) => {
          $('#top-visits').append(`
            <tr>
              <td><a href='${url._links.shortURL.href}'>${url._links.shortURL.href}</a></td>
              <td>${url.visits}</td>
              <td>${url.lastVisit || ''}</td>
            </tr>`)
        })
      })
      .catch(function () {
        $('#result-copy').text('Something went wrong!')
      })
  })()

  // handle url creation request
  $('#url-form').submit((event) => {
    event.preventDefault()
    const payload = {
      longURL: $('#long-url').val()
    }
    // Send request to generate a short url
    axios.post('/v1.0/urls', payload)
      .then(function (response) {
        if (response
          && response.data
          && response.data._links
          && response.data._links.shortURL
          && response.data._links.shortURL.href) {
          $('#result-copy').text(response.data._links.shortURL.href)
        } else {
          $('#result-copy').text('Something went wrong!')
        }
      })
      .catch(function (error) {
        if (error.response && error.response.status === 400) {
          $('#result-copy').text('please type in a valid uri!')
        } else {
          $('#result-copy').text('Something went wrong!')
        }
      })
  })
})(jQuery)
