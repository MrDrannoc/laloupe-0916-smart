function carousel3Controller(tmdbService, $location) {

    this.tmdbService = tmdbService;
    this.$location = $location;

    //CAROUSEL DERNIERS EPISODES
    this.loadrandomEpisode = () => {
        this.tmdbService.randomEpisode().then((response) => {
            this.results = response.data.results.slice(10, 19);
            let count = 0;
            this.results.forEach((result, indexEpisode) => {
                this.results[indexEpisode].i = count;
                count++;
                this.tmdbService.sheetSerie(result.id).then((response) => {
                    Object.assign(this.results[indexEpisode], response.data);
                });
            });
            this.slickCurrentIndex = 0;
            this.slickConfig = {
                // dots: true,
                // initialSlide: 0,
                slidesToShow: 3,
                infinite: true,
                dots: true,
                autoplay: true,
                responsive: [{
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                        }
                    }, {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    }, {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }]
                //centerMode: true,
                // variableWidth: true,
                // method: {},
            };
        });
    };

    this.loadrandomEpisode();

    this.tvShowView = (id) => {
        $location.path("/serie/" + id);
    };
}