<?php

namespace App\Models;

use App\Enums\GameSessionState;
use App\Enums\PlayerColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable {
    use HasFactory;

    protected $fillable = [
        'name', 'icon', 'auth_identifier', 'auth_type'
    ];

    protected $public = [
        'name',
        'icon',
        'public_id',
        'points',
    ];

    function getPublic() {
        $public_instance = [];

        foreach($this->public as $col) {
            if($col === 'icon') {
                $public_instance[$col] = $this->getUserIconUrl();
                continue;
            }

            $public_instance[$col] = $this[$col];
        }

        return $public_instance;
    }

    function getCurrentSession(): ?GameSession {
        $currentUserSessions = GameSession::query();
        $currentUserSessions->where(function (Builder $query) {
            $nextQuery = 'where';
            foreach(PlayerColor::values() as $color) {
                $query = $query->$nextQuery('player_'.$color.'_id', '=', $this['id']);
                $nextQuery = 'orWhere';
            }
        });
        $currentUserSessions = $currentUserSessions->whereNot('session_state', GameSessionState::Complete)->get();

        if(count($currentUserSessions) == 0) return null;

        return $currentUserSessions[0];
    }

    function getCurrentSessionColor(): ?PlayerColor {
        $current_session = $this->getCurrentSession();
        if(is_null($current_session)) return null;

        foreach(PlayerColor::values() as $color) {
            if($current_session['player_'.$color.'_id'] == $this['id']) return PlayerColor::from($color);
        }

        return null;
    }

    function getUserIconUrl(): string {
        if(is_null($this['icon'])) return '';

        $data = DB::table('user_portraits')->where('id', $this['icon'])->first() ?? [];
        return $data->url;
    }
}
