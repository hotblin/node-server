var token =
  "Bearer eyJhbGciOiJIUzUxMiJ9.eyJhdXRob3JpdGllcyI6IlJPTEVfVVNFUixST0xFX1BMQVRGT1JNLFJPTEVfR09WLFJPTEVfQURNSU4sUk9MRV9ERU1PIiwic3ViIjoiYWRtaW4iLCJleHAiOjE1NzczMjMxNDN9.t6IORyjfuEt-5ZrX-DKC6YiiwBGlaUhP7Cgni8vVTLQr5vA0P-A868EWz-YmT84XCc0BP5WlF-4VTwbkKigjFA";

$("#btn").on("click", function() {
  $.ajax({
    url: "http://127.0.0.1:8081/auth",
    type: "post",
    data: {
      username: "one",
      password: "111"
    }
  });
});

$("#btn1").on("click", function() {
  $.ajax({
    url: "http://127.0.0.1:8081/api",
    type: "get",
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", 42343432);
    },
    success: function(res) {
      console.log(res);
    }
  });
});

$("#btn3").on("click", function() {
  $.ajax({
    url: "http://127.0.0.1:8081/api/user",
    type: "get",
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", token);
    },
    data: {
      a: 1,
      b: 2
    },
    success: function(res) {
      console.log(res);
    }
  });
});

$("#btn4").on("click", function() {
  $.ajax({
    url: "http://127.0.0.1:8081/proxy/sdzk2",
    type: "get",
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", token);
    },
    success: function(res) {
      console.log(res);
    }
  });
});
