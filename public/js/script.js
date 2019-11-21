(function() {
    Vue.component("image-modal", {
        template: "#imageTemplate",
        data: function() {
            return {
                images: [],
                comments: [],
                username: "",
                title: "",
                desc: "",
                comment: "",
                user: ""
            };
        },
        props: ["postTitle", "selectedImage"],
        watch: {
            selectedImage: function() {
                this.imageAndComments();
            }
        },
        mounted: function() {
            this.imageAndComments();
        },
        methods: {
            closeModal: function() {
                this.$emit("close", this.count);
            },
            imageAndComments: function() {
                axios
                    .get(`/images/${this.selectedImage}`)
                    .then(
                        function(resp) {
                            if (resp.data.images) {
                                this.images = resp.data.images;
                                this.comments = resp.data.comments.reverse();
                            } else {
                                this.$emit("close");
                            }
                        }.bind(this)
                    )
                    .catch(function() {
                        console.log("catch");
                    });
            },
            submit: function() {
                let commentData = {
                    imageId: this.selectedImage,
                    user: this.user,
                    comment: this.comment
                };
                axios
                    .post("/comment", commentData)
                    .then(
                        function(res) {
                            this.comment = res.data.comment;
                            this.comments.unshift(res.data);
                        }.bind(this)
                    )
                    .catch(function(error) {
                        this.error = true;
                        console.log("error: ", error);
                    });
            }
        }
    });
    new Vue({
        el: "#main",
        data: {
            images: [],
            username: "",
            title: "",
            desc: "",
            file: null,
            selectedImage: location.hash.slice(1),
            showButton: true
        },
        created: function() {
            console.log("created!");
        },
        mounted: function() {
            var self = this;
            addEventListener("hashchange", function() {
                self.selectedImage = location.hash.slice(1);
            });
            axios
                .get("/images")
                .then(
                    function(resp) {
                        this.images = resp.data;
                    }.bind(this)
                )
                .catch(function() {
                    console.log("catch");
                });
        },
        updated: function() {
            console.log("updated!");
        },
        methods: {
            upload: function() {
                var fd = new FormData();
                fd.append("image", this.file);
                fd.append("username", this.username);
                fd.append("title", this.title);
                fd.append("desc", this.desc);
                axios
                    .post("/upload", fd)
                    .then(
                        function(res) {
                            this.images.unshift(res.data);
                        }.bind(this)
                    )
                    .catch(function(error) {
                        this.error = true;
                        console.log("error: ", error);
                    });
            },
            moreImg: function() {
                let lastId = this.images[this.images.length - 1].id;
                axios
                    .get(`/moreimages/${lastId}`)
                    .then(
                        function(resp) {
                            for (let i = 0; i < resp.data.rows.length; i++) {
                                if (
                                    resp.data.rows[i].id ===
                                    resp.data.rows[i].lowest_id
                                ) {
                                    this.showButton = false;
                                }
                                this.images.push(resp.data.rows[i]);
                            }
                        }.bind(this)
                    )
                    .catch(function() {
                        console.log("catch");
                    });
            },
            fileSelected: function(e) {
                console.log(e.target.files);
                this.file = e.target.files[0];
            },
            closeMe: function(count) {
                console.log("closeMe: ", count);
                this.selectedImage = null;
                location.hash = "";
                history.replaceState(null, null, " ");
            }
        }
    });
})();
